// backend/seed.js
// This script connects to MySQL, creates the required tables if they don't exist,
// clears existing data, and inserts seed records for chart1 and chart2.

const mysql = require('mysql2/promise');

(async () => {
  // Configure the connection using environment variables or defaults
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST     || '127.0.0.1',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    database: process.env.DB_NAME     || 't63'
  });

  // Create chart1 table (label, value)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS chart1 (
      id    INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL UNIQUE,
      value INT NOT NULL
    );
  `);

  // Create chart2 table (category, metric)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS chart2 (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(255) NOT NULL UNIQUE,
      metric   DECIMAL(10,2) NOT NULL
    );
  `);

  // Clear existing data
  await connection.execute('TRUNCATE TABLE chart1');
  await connection.execute('TRUNCATE TABLE chart2');

  // Seed data for chart1: Wind, Solar, Urban Cooling
 const chart1Data = [
    ['Solar PV (GW)',452],
    ['Wind (GW)',113],
    ['Hydropower (GW)',15],
    ['Bioenergy (GW)',4.6],
    ['Geothermal (GW)',0.4]
  ];
  await connection.query(
    'INSERT INTO chart1 (label, value) VALUES ?',
    [chart1Data]
  );

  // Seed data for chart2: innovations by month
  const chart2Data = [
    ['Asia ( GW)',421.5],
    ['Europe ( GW)',70.1],
    ['North America ( GW)',45.9],
    ['Latin America ( GW)',22.5],
    ['Oceania ( GW)', 8.7],
    ['Africa ( GW)',4.2],
    ['Middle East ( GW)',3.3]
  ]
  await connection.query(
    'INSERT INTO chart2 (category, metric) VALUES ?',
    [chart2Data]
  );

  console.log('Seeding complete');
  await connection.end();
})();
