import { NextResponse } from "next/server";
import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { LRUCache } from "lru-cache";
import { config_data } from "@/../public/data/grade_config";

const dbPath = path.join(process.cwd(), "public", "data", "grades.sqlite");

const cache = new LRUCache<string, any[]>({
	max: 1000,
	ttl: 1000 * 60 * 60,
});

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

let tablesPromise: Promise<string[]> | null = null;

async function getTables(db: Database): Promise<string[]> {
	if (!tablesPromise) {
		tablesPromise = db
			.all(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`)
			.then((rows: { name: string }[]) => rows.map((row) => row.name));
	}
	return tablesPromise;
}

function getMatchingTables(
	tables: string[],
	year: string | null,
	semester: string | null
): string[] {
	let matchingTables: string[] = [];

	if (year && semester) {
		const tableName = `${year}-${semester}`.toLowerCase();
		if (tables.includes(tableName)) {
			matchingTables.push(tableName);
		} else {
			return [];
		}
	} else if (year || semester) {
		matchingTables = tables.filter((tableName) => {
			if (tableName === "allgrades") return false;
			const [tableYear, tableSemester] = tableName.split("-");
			if (year && tableYear !== year) return false;
			if (semester && tableSemester.toLowerCase() !== semester.toLowerCase()) return false;
			return true;
		});
	} else {
		matchingTables.push("allgrades");
	}

	return matchingTables;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const year = searchParams.get("year");
	const semester = searchParams.get("semester");
	const career = searchParams.get("career");
	const instructor = searchParams.get("instructor");
	const subjectId = searchParams.get("subjectId");
	const courseNumber = searchParams.get("courseNumber");
	const sectionNumber = searchParams.get("sectionNumber");
	const minGpa = searchParams.get("gpa");
	const limit = parseInt(searchParams.get("limit") ?? "50");
	const sort = searchParams.get("sort");
	const direction = searchParams.get("direction") ?? "asc";

	if (
		![year, semester, career, instructor, subjectId, courseNumber, sectionNumber, minGpa].some(
			(param) => param !== null
		)
	) {
		return NextResponse.json({
			status: "OK",
			message: {
				__description: "Here's a list of valid parameters and values",
				limit: "-1 to 1000",
				direction: ["asc", "desc"],
				sort: [
					"year",
					"semester",
					"career",
					"instructor",
					"subjectId",
					"courseNumber",
					"sectionNumber",
					"gpa",
				],
				gpa: "0.0 to 4.0",
				subjectId: config_data.subjectId,
				year: config_data.year,
				semester: config_data.semester,
				career: config_data.career,
				instructor: config_data.instructor,
				courseNumber: config_data.courseNumber,
				sectionNumber: config_data.sectionNumber,
			},
			data: [],
		});
	}

	const cacheKey = request.url;

	if (cache.has(cacheKey)) {
		const cachedResponse = cache.get(cacheKey);
		return NextResponse.json(cachedResponse);
	}

	const conditions: string[] = [];
	const params: any[] = [];

	if (career) {
		conditions.push("LOWER(career) = LOWER(?)");
		params.push(career);
	}

	if (instructor) {
		const instructorColumns = [
			"instructor1",
			"instructor2",
			"instructor3",
			"instructor4",
			"instructor5",
		];
		const instructorConditions = instructorColumns.map((col) => `LOWER(${col}) LIKE LOWER(?)`);
		conditions.push(`(${instructorConditions.join(" OR ")})`);
		const instructorParam = `%${instructor}%`;
		params.push(...Array(instructorColumns.length).fill(instructorParam));
	}

	if (subjectId) {
		conditions.push("LOWER(subjectId) = LOWER(?)");
		params.push(subjectId);
	}

	if (courseNumber) {
		conditions.push("courseNumber = ?");
		params.push(courseNumber);
	}

	if (sectionNumber) {
		conditions.push("sectionNumber = ?");
		params.push(sectionNumber);
	}

	if (minGpa) {
		conditions.push("course_gpa >= ?");
		params.push(parseFloat(minGpa));
	}

	try {
		const db = await getDatabase();
		const tables = await getTables(db);

		const matchingTables = getMatchingTables(tables, year, semester);

		if (matchingTables.length === 0) {
			return NextResponse.json([]);
		}

		const queryParts: string[] = [];

		for (const tableName of matchingTables) {
			let subQuery = `SELECT * FROM "${tableName}"`;
			if (conditions.length > 0) {
				subQuery += " WHERE " + conditions.join(" AND ");
			}
			queryParts.push(subQuery);
		}

		let query = queryParts.join(" UNION ALL ");

		const allowedSortColumns = [
			"year",
			"semester",
			"career",
			"instructor",
			"subjectId",
			"courseNumber",
			"sectionNumber",
			"course_gpa",
		];
		if (sort && allowedSortColumns.includes(sort)) {
			const dir = direction.toLowerCase() === "desc" ? "DESC" : "ASC";
			query += ` ORDER BY ${sort} ${dir}`;
		}

		if (limit !== -1) {
			query += " LIMIT ?";
			params.push(limit < 1000 ? limit : 1000);
		}

		const rows = await db.all(query, params);

		cache.set(cacheKey, rows);

		return NextResponse.json({ status: "OK", data: rows });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json({ error: "Database error" }, { status: 500 });
	}
}
