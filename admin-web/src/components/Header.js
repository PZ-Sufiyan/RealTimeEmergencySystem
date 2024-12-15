import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Emergency Response Admin</h1>
      </div>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/incidents">Incidents</Link>
        <Link to="/agents">Agents</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
    </header>
  );
};

export default Header;
