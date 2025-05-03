// backend/seed.js
// This script connects to the MySQL database, ensures the required tables exist,
// clears any existing records in those tables, and then inserts/upserts the seed data.
// Run with: `node seed.js` (or via npm script)

const mysql = require('mysql2/promise');

(async () => {
  // Configure connection using env vars or defaults
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'yyb3317',
    database: process.env.DB_NAME || 't63'
  });
  

  // Create chart1 table with UNIQUE constraint on label
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS chart1 (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      value INT NOT NULL,
      UNIQUE KEY unique_label (label)
    );
  `);

  // Create chart2 table with UNIQUE constraint on category
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS chart2 (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      metric DECIMAL(10,2) NOT NULL,
      UNIQUE KEY unique_category (category)
    );
  `);

  // Upsert seed data into chart1
  await connection.query(
    `INSERT INTO chart1 (label, value) VALUES ?
     ON DUPLICATE KEY UPDATE value = VALUES(value);`,
    [[
      ['Innovation A', 20],
      ['Innovation B', 35],
      ['Innovation C', 45]
    ]]
  );

  // Upsert seed data into chart2
  await connection.query(
    `INSERT INTO chart2 (category, metric) VALUES ?
     ON DUPLICATE KEY UPDATE metric = VALUES(metric);`,
    [[
      ['Solar Capacity', 150.00],
      ['Wind Capacity', 120.00],
      ['Hydro Capacity', 90.50]
    ]]
  );

  console.log('✅ Database seeded successfully.');
  await connection.end();
})();
