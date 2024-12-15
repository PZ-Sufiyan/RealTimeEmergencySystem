import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Incidents</li>
        <li>Agents</li>
        <li>Analytics</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
