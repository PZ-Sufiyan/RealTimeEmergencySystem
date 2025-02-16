import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./AgentMonitoring.css";
import Agent_Modal from "../../components/Modals/Agent_Modal";

const uri = "https://alert-system-fastapi-8749c7285c49.herokuapp.com";

function AgentMonitoring() {
  const [agents, setAgents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${uri}/agents`);
        if (response.data && response.data.agents) {
          setAgents(Object.values(response.data.agents));
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      mapRef.current = new window.google.maps.Map(document.getElementById("agent-map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center
        zoom: 10,
      });
      updateMarkers();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [agents]);

  const updateMarkers = () => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    agents.forEach((agent) => {
      if (agent.location && agent.location.latitude && agent.location.longitude) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(agent.location.latitude),
            lng: parseFloat(agent.location.longitude),
          },
          map: mapRef.current,
          title: `Agent: ${agent.name}`,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });
        markersRef.current.push(marker);
      }
    });
  };

  return (
    <div className="agent-monitoring">
      <h1>Agent Monitoring</h1>
      <div id="agent-map" className="map" style={{ height: "500px", width: "100%" }}></div>
      <div className="agent-list">
  <div className="agentList-header">
    <h2>Agent List</h2>
    <button onClick={() => setIsOpen(true)} className="addAgent-btn">
      New Agent
    </button>
  </div>
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Location</th>
          <th>View Details</th>
        </tr>
      </thead>
      <tbody>
        {agents.slice(0, 10).map((agent) => (
          <tr key={agent.id}>
            <td>{agent.id}</td>
            <td>{agent.name}</td>
            <td>{agent.status}</td>
            <td>{agent.email}</td>
            <td>{agent.phone}</td>
            <td>
              {agent.location.latitude && agent.location.longitude
                ? `${agent.location.latitude}, ${agent.location.longitude}`
                : "N/A"}
            </td>
            <td>
              <button
                className="view-button"
                onClick={() => setSelectedAgent(agent)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {selectedAgent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedAgent(null)}>
              &times;
            </span>
            <h2>Agent Details</h2>
            <p><strong>Name:</strong> {selectedAgent.name}</p>
            <p><strong>Email:</strong> {selectedAgent.email}</p>
            <p><strong>Contact:</strong> {selectedAgent.phone}</p>
            <p><strong>Location:</strong>
              {selectedAgent.location.latitude && selectedAgent.location.longitude
                ? `${selectedAgent.location.latitude}, ${selectedAgent.location.longitude}`
                : "N/A"}
            </p>
            <p><strong>Status:</strong> {selectedAgent.status}</p>
          </div>
        </div>
      )}
      <Agent_Modal isOpen={isOpen} setIsOpen={setIsOpen} setAgents={setAgents} />
    </div>
  );
}

export default AgentMonitoring;