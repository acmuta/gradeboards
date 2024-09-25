import { NextResponse } from 'next/server';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { LRUCache } from 'lru-cache';
import { config_data } from '@/../public/data/config';

// Construct the path to the SQLite database
const dbPath = path.join(process.cwd(), 'public', 'data', 'grades.sqlite');

// Create an LRU cache to store query results
const cache = new LRUCache<string, any[]>({
  max: 1000, // Maximum number of items in cache
  ttl: 1000 * 60 * 60, // Cache items for 1 hour
});

// Function to open the database connection
let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

async function getDatabase() {
  if (!dbPromise) {
    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}

// Function to get all table names, cached for future requests
// Function to get all table names, cached for future requests
let tablesPromise: Promise<string[]> | null = null;

async function getTables(db: Database): Promise<string[]> {
  if (!tablesPromise) {
    tablesPromise = db
      .all(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
      )
      .then((rows: { name: string }[]) => rows.map((row) => row.name));
  }
  return tablesPromise;
}


// Helper function to get matching tables based on year and semester
function getMatchingTables(
  tables: string[],
  year: string | null,
  semester: string | null
): string[] {
  let matchingTables: string[] = [];

  if (year && semester) {
    // Specific table for the given year and semester
    const tableName = `${year}-${semester}`.toLowerCase();
    if (tables.includes(tableName)) {
      matchingTables.push(tableName);
    } else {
      // Table does not exist
      return [];
    }
  } else if (year || semester) {
    // Find tables that match the year and/or semester
    matchingTables = tables.filter((tableName) => {
      if (tableName === 'allgrades') return false;
      const [tableYear, tableSemester] = tableName.split('-');
      if (year && tableYear !== year) return false;
      if (semester && tableSemester.toLowerCase() !== semester.toLowerCase())
        return false;
      return true;
    });
  } else {
    // No year or semester provided, use 'allgrades' table
    matchingTables.push('allgrades');
  }

  return matchingTables;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const year = searchParams.get('year');
  const semester = searchParams.get('semester');
  const career = searchParams.get('career');
  const instructor = searchParams.get('instructor');
  const subjectId = searchParams.get('subjectId');
  const courseNumber = searchParams.get('courseNumber');
  const sectionNumber = searchParams.get('sectionNumber');
  const minGpa = searchParams.get('minGpa');
  const limit = parseInt(searchParams.get('limit') || '50');
  const sort = searchParams.get('sort');
  const direction = searchParams.get('direction') || 'asc';

  // Return an empty array if no parameters are provided
  if (
    ![
      year,
      semester,
      career,
      instructor,
      subjectId,
      courseNumber,
      sectionNumber,
      minGpa,
    ].some((param) => param !== null)
  ) {
    /*
     * UPDATE VALID PARAMETERS
     */
    return NextResponse.json({ 
      status: "OK", 
      message: {
        "_description": "List of valid parameters", 
        limit: "-1 to 1000",
        sort: ["asc", "desc"],
        direction: ['year', 'semester', 'career', 'instructor1', 'subjectId', 'courseNumber', 'sectionNumber', 'course_gpa'],
        minGpa: "0.0 to 4.0",
        subjectId: config_data.subjectId,
        year: config_data.year,
        semester: config_data.semester,
        career: config_data.career,
        instructor: config_data.instructor,
        courseNumber: config_data.courseNumber,
        sectionNumber: config_data.sectionNumber,
      }, 
      data: []
    });
  }

  // Build a unique cache key based on the request URL
  const cacheKey = request.url;

  // Check if the response is already in the cache
  if (cache.has(cacheKey)) {
    const cachedResponse = cache.get(cacheKey);
    return NextResponse.json(cachedResponse);
  }

  // Build conditions and parameters for the SQL query
  const conditions: string[] = [];
  const params: any[] = [];

  if (career) {
    conditions.push('LOWER(career) = LOWER(?)');
    params.push(career);
  }

  if (instructor) {
    const instructorColumns = [
      'instructor1',
      'instructor2',
      'instructor3',
      'instructor4',
      'instructor5',
    ];
    const instructorConditions = instructorColumns.map(
      (col) => `LOWER(${col}) LIKE LOWER(?)`
    );
    conditions.push(`(${instructorConditions.join(' OR ')})`);
    const instructorParam = `%${instructor}%`;
    params.push(...Array(instructorColumns.length).fill(instructorParam));
  }

  if (subjectId) {
    conditions.push('LOWER(subjectId) = LOWER(?)');
    params.push(subjectId);
  }

  if (courseNumber) {
    conditions.push('courseNumber = ?');
    params.push(courseNumber);
  }

  if (sectionNumber) {
    conditions.push('sectionNumber = ?');
    params.push(sectionNumber);
  }

  if (minGpa) {
    conditions.push('course_gpa >= ?');
    params.push(parseFloat(minGpa));
  }

  try {
    // Get the database connection and table names
    const db = await getDatabase();
    const tables = await getTables(db);

    // Get matching tables based on year and/or semester
    const matchingTables = getMatchingTables(tables, year, semester);

    if (matchingTables.length === 0) {
      // No matching tables found
      return NextResponse.json([]);
    }

    // Build the SQL query using UNION ALL for multiple tables
    const queryParts: string[] = [];

    for (const tableName of matchingTables) {
      let subQuery = `SELECT * FROM "${tableName}"`;
      if (conditions.length > 0) {
        subQuery += ' WHERE ' + conditions.join(' AND ');
      }
      queryParts.push(subQuery);
    }

    let query = queryParts.join(' UNION ALL ');

    // Validate sort column and direction
    const allowedSortColumns = [
      'year',
      'semester',
      'career',
      'instructor1',
      'subjectId',
      'courseNumber',
      'sectionNumber',
      'course_gpa',
    ];
    if (sort && allowedSortColumns.includes(sort)) {
      const dir = direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sort} ${dir}`;
    }

    // Apply limit
    if (limit !== -1) {
      query += ' LIMIT ?';
      params.push(limit < 1000 ? limit : 1000);
    }

    // Execute the query and get the results
    const rows = await db.all(query, params);

    // Store the results in the cache
    cache.set(cacheKey, rows);

    // Return the results as a JSON response
    return NextResponse.json({ status: "OK", data: rows});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
