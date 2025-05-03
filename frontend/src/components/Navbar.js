import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <nav aria-label="Main menu">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/summary">Summary</NavLink>
      <NavLink to="/reports">Reports</NavLink>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
