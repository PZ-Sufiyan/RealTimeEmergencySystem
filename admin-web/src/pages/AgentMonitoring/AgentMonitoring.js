import React, { useEffect, useState } from "react";
import "./AgentMonitoring.css";
import Agent_Modal from "../../components/Modals/Agent_Modal";

const sampleAgents = [
  { id: 1, name: "Agent A", email: "agentA@example.com", contact: "123-456-7890", password: "agent@123", lat: 37.7749, lng: -122.4194, status: "Online" },
  { id: 2, name: "Agent B", email: "agentB@example.com", contact: "987-654-3210", password: "agent@456", lat: 34.0522, lng: -118.2437, status: "Offline" },
  { id: 3, name: "Agent C", email: "agentC@example.com", contact: "555-666-7777", password: "agent@789", lat: 40.7128, lng: -74.006, status: "Online" },
];

function AgentMonitoring() {
  const [agents, setAgents] = useState(sampleAgents);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("agent-map"), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4,
      });

      agents.forEach((agent) => {
        if (agent.status === "Online") {
          new window.google.maps.Marker({
            position: { lat: agent.lat, lng: agent.lng },
            map: map,
            title: agent.name,
          });
        }
      });
    };
  }, [agents]);

  return (
    <div className="agent-monitoring">
      <h1>Agent Monitoring</h1>
      <div id="agent-map" className="map"></div>
      <div className="agent-list">
        <div className="agentList-header">
          <h2>Agent List</h2>
          <button onClick={() => setIsOpen(true)} className="addAgent-btn">New Agent</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Location</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>{agent.status}</td>
                <td>{agent.lat.toFixed(2)}, {agent.lng.toFixed(2)}</td>
                <td>
                  <button className="view-button" onClick={() => setSelectedAgent(agent)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Popup */}
      {selectedAgent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedAgent(null)}>
              &times;
            </span>
            <h2>Agent Details</h2>
            <p><strong>Name:</strong> {selectedAgent.name}</p>
            <p><strong>Email:</strong> {selectedAgent.email}</p>
            <p><strong>Contact:</strong> {selectedAgent.contact}</p>
            <p><strong>Password:</strong> {selectedAgent.password}</p>
            <p><strong>Location:</strong> {selectedAgent.lat.toFixed(2)}, {selectedAgent.lng.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedAgent.status}</p>
          </div>
        </div>
      )}

      <Agent_Modal isOpen={isOpen} setIsOpen={setIsOpen} setAgents={setAgents} />
    </div>
  );
}

export default AgentMonitoring;
