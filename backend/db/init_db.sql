-- backend/db/init_db.sql

-- 1) Create & select our project database
CREATE DATABASE IF NOT EXISTS t63;
USE t63;

-- 2) Create chart1 with a UNIQUE constraint on label to allow upserts
CREATE TABLE IF NOT EXISTS chart1 (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value INT NOT NULL,
  UNIQUE KEY unique_label (label)
);

-- 3) Create chart2 with a UNIQUE constraint on category for upserts
CREATE TABLE IF NOT EXISTS chart2 (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  metric   DECIMAL(10,2) NOT NULL,
  UNIQUE KEY unique_category (category)
);

-- 4) Upsert seed data into chart1
INSERT INTO chart1 (label, value) VALUES
  ('Innovation A', 20),
  ('Innovation B', 35),
  ('Innovation C', 45)
ON DUPLICATE KEY UPDATE
  value = VALUES(value);

-- 5) Upsert seed data into chart2
INSERT INTO chart2 (category, metric) VALUES
  ('Solar Capacity', 150.00),
  ('Wind Capacity', 120.00),
  ('Hydro Capacity', 90.50)
ON DUPLICATE KEY UPDATE
  metric = VALUES(metric);
