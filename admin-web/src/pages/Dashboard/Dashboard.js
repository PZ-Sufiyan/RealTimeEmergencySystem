import React, { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    active: 10,
    resolved: 25,
    pending: 5,
  });

  const incidents = [
    { id: 1, type: "Fire", location: "123 Main St", time: "2024-12-19 10:00 AM", priority: "High" },
    { id: 2, type: "Medical", location: "456 Elm St", time: "2024-12-19 11:00 AM", priority: "Medium" },
    { id: 3, type: "Police", location: "789 Oak St", time: "2024-12-19 12:00 PM", priority: "Low" },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">Active: {stats.active}</div>
        <div className="stat">Resolved: {stats.resolved}</div>
        <div className="stat">Pending: {stats.pending}</div>
      </div>
      <div className="map">
        <h2>Real-Time Map</h2>
        <div className="map-placeholder">Map Placeholder (Integrate map here)</div>
      </div>
      <div className="recent-incidents">
        <h2>Recent Incidents</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Location</th>
              <th>Time</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td>{incident.type}</td>
                <td>{incident.location}</td>
                <td>{incident.time}</td>
                <td>{incident.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;