import React, { useEffect, useState } from "react";
import "./AgentMonitoring.css";

// Sample agent data (can be replaced with live data from an API or Firebase)
const sampleAgents = [
  { id: 1, name: "Agent A", lat: 37.7749, lng: -122.4194, status: "Online" }, // San Francisco
  { id: 2, name: "Agent B", lat: 34.0522, lng: -118.2437, status: "Offline" }, // Los Angeles
  { id: 3, name: "Agent C", lat: 40.7128, lng: -74.006, status: "Online" }, // New York
];

function AgentMonitoring() {
  const [agents, setAgents] = useState(sampleAgents);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("agent-map"), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of the USA
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
        <h2>Agent List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>{agent.status}</td>
                <td>
                  {agent.lat.toFixed(2)}, {agent.lng.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgentMonitoring;
