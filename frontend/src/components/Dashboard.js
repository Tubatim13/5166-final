// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [summary, setSummary] = useState({ text: '', source: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/summary', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSummary({
          text: response.data.text,
          source: response.data.source,
        });
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError('Failed to load summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>

      {loading && <p>Loading summary…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <section>
            <article>
              <p>{summary.text}</p>
              <a href={summary.source} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </article>
          </section>

          <section>
            <h2>Tech Stack & Infrastructure</h2>
            <p>
              This application is built as a React (v18) Single Page Application, served from
              NGINX on port 80, with client‑side routing via React Router. The backend is a
              Node.js + Express API on port 3000, using MySQL for persistent data and JSON
              Web Tokens (JWT) for authentication. Chart data is visualized using D3.js, and
              environment variables (including DB credentials and JWT secret) are managed via
              a `.env` file and loaded with `dotenv`.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
