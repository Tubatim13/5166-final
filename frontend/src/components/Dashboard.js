import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [summary, setSummary] = useState({ text:'', source:'' });

  useEffect(() => {
    axios.get('http://localhost/api/summary', {
      headers: { Authorization:`Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setSummary(res.data))
    .catch(console.error);
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>
      <article>
        <p>{summary.text}</p>
        <a href={summary.source} target="_blank" rel="noopener">Source</a>
      </article>
      <section>
        <h2>Tech Stack & Infrastructure</h2>
        <p>
          React (v18) frontend with React Router; Node + Express backend on port 3000; MySQL for data; 
          JWT for auth; NGINX serving frontend on port 80 and proxying `/api`; D3.js for charts.
        </p>
      </section>
    </main>
  );
}
