import React, { useState } from "react";
import "./AgentMonitoring.css";

function AgentMonitoring() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Agent A", location: "123 Main St", status: "Online", incidents: 3 },
    { id: 2, name: "Agent B", location: "456 Elm St", status: "Offline", incidents: 1 },
    { id: 3, name: "Agent C", location: "789 Oak St", status: "Online", incidents: 5 },
  ]);

  return (
    <div className="agent-monitoring">
      <h1>Agent Monitoring</h1>
      <div className="map">
        <h2>Agent Locations</h2>
        <div className="map-placeholder">Map Placeholder (Integrate map here)</div>
      </div>
      <div className="agent-list">
        <h2>Agent List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Incidents Assigned</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>{agent.location}</td>
                <td>{agent.status}</td>
                <td>{agent.incidents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentMonitoring;