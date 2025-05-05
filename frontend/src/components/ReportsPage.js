// src/components/ReportsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChartComponent from './PieChartComponent';

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/chart2', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching chart2 data:', err);
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <main>
      <h1>Reports Chart</h1>

      {loading && <p>Loading chart…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <PieChartComponent  data={data} labelKey="label" valueKey="value" ariaLabel="Report data pie chart" />

          <p>
            Regionally, Asia led the 2024 surge by contributing 421.5 GW (72% of the global increase), followed by Europe (70.1 GW), North America (45.9 GW), Latin America (22.5 GW), Oceania (8.7 GW), Africa (4.2 GW), and the Middle East (3.3 GW). This distribution highlights Asia’s pivotal role while showing broad‐based global growth. (Data originating from the linked source and seeded into the t63 database.)
          </p>
        </>
      )}
    </main>
);
}
