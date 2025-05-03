// src/components/SummaryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

export default function SummaryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/chart1', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching chart1 data:', err);
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <main>
      <h1>Summary Chart</h1>

      {loading && <p>Loading chart…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <ChartComponent
            data={data}
            labelKey="label"
            valueKey="value"
            ariaLabel="Bar chart of recent clean‑energy innovations"
          />

          <p>
            This bar chart visualizes the number of clean‑energy innovations introduced in the
            last six months, broken down by innovation type. The underlying data is fetched
            asynchronously from our MySQL database via the `/api/chart1` endpoint and reflects
            seed values representing capacity metrics. Source: internal T63 database.
          </p>
        </>
      )}
    </main>
  );
}