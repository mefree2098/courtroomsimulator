// src/components/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/case/generate">Start a New Case</Link>
      <Link to="/case/summary">View Case Summaries</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
