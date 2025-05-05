-- backend/db/init_db.sql
-- Create the database and switch to it
CREATE DATABASE IF NOT EXISTS t63;
USE t63;

-- Create chart1 table with unique constraint on label
CREATE TABLE IF NOT EXISTS chart1 (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value INT          NOT NULL,
  UNIQUE KEY unique_label (label)
);

-- Create chart2 table with unique constraint on category
CREATE TABLE IF NOT EXISTS chart2 (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255)    NOT NULL,
  metric   DECIMAL(10,2)   NOT NULL,
  UNIQUE KEY unique_category (category)
);

-- Insert or update seed data for chart1
INSERT INTO chart1 (label, value) VALUES
  ('Solar PV ( GW)',452),
  ('Wind ( GW)',113),
  ('Hydropower ( GW)',15),
  ('Bioenergy ( GW)',4.6),
  ('Geothermal ( GW)',0.4)
ON DUPLICATE KEY UPDATE
  value = VALUES(value);

-- Insert or update seed data for chart2
INSERT INTO chart2 (category, metric) VALUES
  ('Asia ( GW)',421.5),
  ('Europe ( GW)',70.1),
  ('North America ( GW)',45.9),
  ('Latin America ( GW)',22.5),
  ('Oceania ( GW)',value": 8.7),
  ('Africa ( GW)',4.2),
  ('Middle East ( GW)',3.3)
ON DUPLICATE KEY UPDATE
  metric = VALUES(metric);
