import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';
import axios from 'axios';

export default function SummaryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/api/chart1', {
      headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setData(res.data.data))
    .catch(console.error);
  }, []);

  return (
    <main>
      <h1>Summary Chart</h1>
      <ChartComponent data={data} labelKey="label" valueKey="value" />
      <p>This chart shows recent clean‑energy innovations: … (data from our MySQL seed).</p>
    </main>
  );
}
