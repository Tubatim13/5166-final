import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import axios from 'axios';

export default function ReportsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/chart2', {
      headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setData(res.data.data))
    .catch(console.error);
  }, []);

  return (
    <main>
      <h1>Reports Chart</h1>
      <ChartComponent data={data} labelKey="label" valueKey="value" />
      <p>This chart tracks capacity metrics for solar, wind, hydro (seed data).</p>
    </main>
  );
}
