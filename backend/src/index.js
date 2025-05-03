const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const { USERNAME, PASSWORD, JWT_SECRET } = require('./config/auth');
const authenticateJWT = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL pool setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 't63',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 1) Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// 2) Summary endpoint
app.get('/summary', authenticateJWT, (req, res) => {
  const summaryText = `Over the past six months, climate scientists and engineers have unveiled a series of groundbreaking clean energy innovations. In January, the United States launched its first commercial‑scale offshore wind farm off Martha’s Vineyard, providing large‑scale ocean‑based renewable power. Shortly thereafter, researchers tested the first solar power demonstration in space, successfully beaming collected energy back to Earth as proof of concept for extraterrestrial photovoltaics. An underwater kite generator that mimics figure‑eight motions began feeding 1.2 MW into the Faroe Islands’ grid, harnessing fast‑moving currents more efficiently than traditional turbines. A novel wind‑powered electrodynamic screen was developed to actively repel dust from solar panels, boosting their performance without mechanical cleaning. Simultaneous radiative cooling and solar generation technology debuted, allowing dual‑function surfaces to harvest electricity while shedding heat. Material scientists also introduced a glass‑ceramic layer that upconverts ultraviolet light into visible wavelengths, effectively increasing solar panel yield. Urban researchers published cooling scenario simulations showing reflective rooftops and irrigated greenery can lower city temperatures significantly. These innovations, documented in the “2024 in climate change” review, represent significant strides toward scalable, resilient clean energy systems. These breakthroughs underscore the pace of clean energy and point to a decarbonized world. These developments offer hope for global decarbonization.`;
  const sourceUrl = 'https://en.wikipedia.org/wiki/2024_in_climate_change';
  res.json({ text: summaryText, source: sourceUrl });
});

// 3) Chart endpoints
app.get('/chart1', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT label, value FROM chart1');
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.get('/chart2', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT category AS label, metric AS value FROM chart2
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 4) Health-check
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));