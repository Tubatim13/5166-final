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
  const summaryText = `Recent innovations in clean energy over the last six months include breakthroughs in perovskite solar cell efficiency, advanced offshore wind turbine designs, and large-scale energy storage solutions. Scientists have pushed perovskite efficiency beyond 25%, offering cost-effective alternatives to silicon. Floating offshore wind platforms have scaled up to 15MW capacity units, cutting installation costs in deep waters. Meanwhile, grid-scale flow batteries using vanadium redox chemistry have demonstrated 10+ hour discharge durations, enhancing renewable integration. Policy shifts and improved manufacturing processes have driven down costs further, boosting deployment across Europe, Asia, and North America.`;
  const sourceUrl = 'https://www.example.com/clean-energy-innovations';
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