import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleChange = e => {
    setUser(u => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/login', user);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <main>
      <h1>Login to T63</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={user.username} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={user.password} onChange={handleChange} required />
        </label>
        <button type="submit">Log In</button>
      </form>
    </main>
  );
}
