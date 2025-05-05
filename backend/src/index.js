// backend/src/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');

const { USERNAME, PASSWORD, JWT_SECRET } = require('./config/auth');
const authenticateJWT = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure MySQL connection pool
const pool = mysql.createPool({
  socketPath: '/var/run/mysqld/mysqld.sock',  // your socket path
  user:     't63user',              // your MySQL app user
  password: 'strongPasswordHere',   // that user’s password
  database: 't63',                  // your DB name
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});


// Authentication route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Summary endpoint
app.get('/summary', authenticateJWT, (req, res) => {
  res.json({
    text: `Over the past year, global renewable energy capacity continued its rapid ascent, setting new records across technologies and regions. According to the IRENA “Renewable Capacity Statistics 2025” report, total capacity added in 2024 reached 313 GW. Solar photovoltaic (PV) led the expansion, contributing 196 GW, nearly two‑thirds of all new installations; driven by cost declines and supportive policies in China, India, and the United States. Onshore wind followed with 86 GW of additions, spurred by large procurements in Europe and North America. Offshore wind capacity grew by 14 GW, led by projects in the North Sea and East Asia. Other technologies played smaller but still significant roles: bioenergy added 10 GW, while hydropower and geothermal contributed 4 GW and 3 GW respectively. Regionally, the Asia‑Pacific market dominated 2024 growth, with over half of the global total new capacity (190 GW), reflecting major deployments in China and India. Europe installed 68 GW, including sizeable offshore wind projects. North America added 55 GW, buoyed by U.S. federal tax incentives. Latin America’s market expanded by 25 GW, particularly in Brazil and Mexico, while the Middle East & Africa together installed 10 GW, driven by large‑scale auctions in the Gulf and North Africa. These trends underscore solar PV’s central role and highlight how diverse geographies are contributing to a cleaner, more resilient energy system.`,
    source: 'https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Mar/IRENA_DAT_RE_Capacity_Highlights_2025.pdf'
  });
});

// Chart endpoints
app.get('/chart1', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT label, value FROM chart1');
    return res.json({ data: rows });
  } catch (err) {
    console.error('🔴 chart1 error:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});

app.get('/chart2', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT category AS label, metric AS value FROM chart2');
    return res.json({ data: rows });
  } catch (err) {
    console.error('🔴 chart2 error:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
