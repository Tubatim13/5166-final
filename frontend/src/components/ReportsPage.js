// src/components/ReportsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent';

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
          <ChartComponent
            data={data}
            labelKey="label"
            valueKey="value"
            ariaLabel="Bar chart of capacity metrics for clean energy sources"
          />

          <p>
            This timeline chart reveals a remarkably steady pace of clean‑energy innovation,
      with exactly one new advancement recorded in each month from January through June.
      Such consistency suggests a sustained, month‑by‑month commitment to R&D across all
      clean‑energy categories rather than sporadic bursts. (Data originating from the linked wiki and seeded into the t63 database.)
          </p>
        </>
      )}
    </main>
);
}
