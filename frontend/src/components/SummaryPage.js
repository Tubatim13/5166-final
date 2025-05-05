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
            In 2024, Solar PV dominated new renewable capacity additions with 452 GW, amounting to 77.3% of the global total, while wind added 113 GW, hydropower 15 GW, bioenergy 4.6 GW, and geothermal 0.4 GW. This chart underscores solar’s accelerating cost‑driven deployment and the complementary roles of wind and conventional renewables. (Data sourced from information on the linked dashboard and the internal T63 database.)
          </p>
        </>
      )}
    </main>
  );
}
