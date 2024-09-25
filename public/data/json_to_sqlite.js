const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Function to flatten the grades object into individual fields
function flattenData(item) {
  const { grades, ...rest } = item;
  const flatData = { ...rest };

  for (const grade in grades) {
    flatData['grades_' + grade] = grades[grade];
  }

  return flatData;
}

const allGradeDataFile = 'allgradedata.json';
const files = fs.readdirSync('./public/data').filter(file => file.endsWith('.json'));
const jsonFiles = files.filter(file => file !== allGradeDataFile);

// Collect all data from individual files
const allData = [];

// Open a connection to the SQLite database
const db = new sqlite3.Database('./public/data/grades.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

db.serialize(() => {
  // Process each JSON file and create corresponding tables
  jsonFiles.forEach(file => {
    const fileName = path.basename(`./public/data/${file}`, '.json');
    const data = JSON.parse(fs.readFileSync(`./public/data/${file}`, 'utf-8'));

    if (!data.length) {
      console.log('No data in file:', file);
      return;
    }

    // Collect data for the allgrades table
    allData.push(...data);

    const columns = Object.keys(flattenData(data[0]));
    const columnsDefinition = columns.map(column => `"${column}" TEXT`).join(', ');
    const createTableSql = `CREATE TABLE IF NOT EXISTS "${fileName}" (${columnsDefinition});`;

    db.run(createTableSql, (err) => {
      if (err) {
        console.error('Error creating table', fileName, err.message);
      } else {
        console.log('Table created:', fileName);
      }
    });

    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT INTO "${fileName}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders});`;
    const stmt = db.prepare(insertSql);

    data.forEach(item => {
      const flatItem = flattenData(item);
      const values = columns.map(col => flatItem[col]);

      stmt.run(values, (err) => {
        if (err) {
          console.error('Error inserting data into', fileName, err.message);
        }
      });
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement for', fileName, err.message);
      }
    });
  });

  // Create the 'allgrades' table and insert all data
  if (allData.length > 0) {
    const fileName = 'allgrades';
    const columns = Object.keys(flattenData(allData[0]));
    const columnsDefinition = columns.map(column => `"${column}" TEXT`).join(', ');
    const createTableSql = `CREATE TABLE IF NOT EXISTS "${fileName}" (${columnsDefinition});`;

    db.run(createTableSql, (err) => {
      if (err) {
        console.error('Error creating table', fileName, err.message);
      } else {
        console.log('Table created:', fileName);
      }
    });

    const placeholders = columns.map(() => '?').join(', ');
    const insertSql = `INSERT INTO "${fileName}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders});`;
    const stmt = db.prepare(insertSql);

    allData.forEach(item => {
      const flatItem = flattenData(item);
      const values = columns.map(col => flatItem[col]);

      stmt.run(values, (err) => {
        if (err) {
          console.error('Error inserting data into', fileName, err.message);
        }
      });
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement for', fileName, err.message);
      }
    });
  } else {
    console.log('No data to insert into allgrades table.');
  }

  // Optionally, you can remove or comment out the processing of 'allgradedata.json' since we're creating 'allgrades' table from individual files
  /*
  if (files.includes(allGradeDataFile)) {
    const data = JSON.parse(fs.readFileSync(`./public/data/${allGradeDataFile}`, 'utf-8'));
    const fileName = path.basename(`./public/data/${allGradeDataFile}`, '.json');

    if (!data.length) {
      console.log('No data in file:', allGradeDataFile);
    } else {
      const columns = Object.keys(flattenData(data[0]));
      const columnsDefinition = columns.map(column => `"${column}" TEXT`).join(', ');
      const createTableSql = `CREATE TABLE IF NOT EXISTS "${fileName}" (${columnsDefinition});`;

      db.run(createTableSql, (err) => {
        if (err) {
          console.error('Error creating table', fileName, err.message);
        } else {
          console.log('Table created:', fileName);
        }
      });

      const placeholders = columns.map(() => '?').join(', ');
      const insertSql = `INSERT INTO "${fileName}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders});`;
      const stmt = db.prepare(insertSql);

      data.forEach(item => {
        const flatItem = flattenData(item);
        const values = columns.map(col => flatItem[col]);

        stmt.run(values, (err) => {
          if (err) {
            console.error('Error inserting data into', fileName, err.message);
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing statement for', fileName, err.message);
        }
      });
    }
  }
  */
});

// Close the database connection after all operations are completed
db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Closed the database connection.');
  }
});
