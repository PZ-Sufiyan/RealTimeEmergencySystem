import React, { useState } from "react";
import "./IncidentManagement.css";

function IncidentManagement() {
  const [filter, setFilter] = useState("");
  const incidents = [
    { id: 1, type: "Fire", location: "123 Main St", time: "10:00 AM", priority: "High", agent: "Agent A" },
    { id: 2, type: "Medical", location: "456 Elm St", time: "11:30 AM", priority: "Medium", agent: "Agent B" },
    { id: 3, type: "Theft", location: "789 Oak St", time: "12:15 PM", priority: "Low", agent: "Agent C" },
  ];

  const filteredIncidents = incidents.filter((incident) =>
    incident.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="incident-management">
      <h1>Incident Management</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search incidents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-box"
        />
        <button className="control-button">Assign</button>
        <button className="control-button">Mark Resolved</button>
      </div>
      <table className="incident-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Time</th>
            <th>Priority</th>
            <th>Assigned Agent</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>{incident.type}</td>
              <td>{incident.location}</td>
              <td>{incident.time}</td>
              <td>{incident.priority}</td>
              <td>{incident.agent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentManagement;