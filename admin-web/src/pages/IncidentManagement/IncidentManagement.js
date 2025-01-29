import React, { useState } from "react";
import "./IncidentManagement.css";

function IncidentManagement() {
  const [filter, setFilter] = useState("");
  const [incidents, setIncidents] = useState([
    { id: 1, type: "Fire", location: "123 Main St", time: "10:00 AM", priority: "High", agent: null, resolved: false },
    { id: 2, type: "Medical", location: "456 Elm St", time: "11:30 AM", priority: "Medium", agent: "Agent B", resolved: false },
    { id: 3, type: "Theft", location: "789 Oak St", time: "12:15 PM", priority: "Low", agent: null, resolved: false },
  ]);

  const agents = ["Agent A", "Agent B", "Agent C"];

  const assignAgent = (incidentId, agentName) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident.id === incidentId ? { ...incident, agent: agentName } : incident
      )
    );
  };

  const markResolved = (incidentId) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident.id === incidentId ? { ...incident, resolved: true } : incident
      )
    );

    setTimeout(() => {
      setIncidents((prevIncidents) => prevIncidents.filter((incident) => incident.id !== incidentId));
    }, 500);
  };

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
            <th>Resolved</th>
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
              <td>
                {incident.agent ? (
                  incident.agent
                ) : (
                  <select onChange={(e) => assignAgent(incident.id, e.target.value)}>
                    <option value="">Assign Agent</option>
                    {agents.map((agent, index) => (
                      <option key={index} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {incident.resolved ? (
                  <span className="resolved-text">Resolved</span>
                ) : (
                  <button className="resolve-button" onClick={() => markResolved(incident.id)}>
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentManagement;
