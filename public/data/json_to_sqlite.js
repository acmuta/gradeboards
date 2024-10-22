const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const uni_config = require("../../university_configs.json");

function getActiveUniObj() {
  const activeUni = uni_config[uni_config["__ENABLED_UNIVERSITY"]];
  
  if (Array.isArray(activeUni)) {
    throw new Error("Invalid university configuration");
  }
  return activeUni;
}

function flattenData(item) {
  const { grades, ...rest } = item;
  const flatData = { ...rest };

  for (const grade in grades) {
    flatData['grades_' + grade] = grades[grade];
  }

  return flatData;
}

const allGradeDataFile = 'allgradedata.json';
const files = fs.readdirSync(`./public/data/${getActiveUniObj().university_id}`).filter(file => file.endsWith('.json'));
const jsonFiles = files.filter(file => file !== allGradeDataFile);

const allData = [];

const db = new sqlite3.Database(`./public/data/grades.sqlite`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

db.serialize(() => {
  // Drop all existing tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
    } else if (rows && rows.length) {
      rows.forEach(row => {
        db.run(`DROP TABLE IF EXISTS "${row.name}"`, (err) => {
          if (err) {
            console.error(`Error dropping table ${row.name}:`, err.message);
          } else {
            console.log(`Dropped table: ${row.name}`);
          }
        });
      });
    } else {
      console.log('No existing tables found.');
    }
  });

  jsonFiles.forEach(file => {
    const fileName = path.basename(`./public/data/${getActiveUniObj().university_id}/${file}`, '.json');
    const data = JSON.parse(fs.readFileSync(`./public/data/${getActiveUniObj().university_id}/${file}`, 'utf-8'));

    if (!data.length) {
      console.log('No data in file:', file);
      return;
    }

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
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Closed the database connection.');
  }
});
