import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const uri = "https://alert-system-fastapi-8749c7285c49.herokuapp.com";

function Dashboard() {
  const [stats, setStats] = useState({ active: 0, resolved: 0, pending: 0 });
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(`${uri}/incidents/`);
        if (response.data && response.data.incidents) {
          const allIncidents = Object.values(response.data.incidents);

          // Calculate stats
          const activeCount = allIncidents.filter(
            (incident) => incident.status === "Unresolved" && incident.assigned_agent !== "N/A"
          ).length;
          const resolvedCount = allIncidents.filter(
            (incident) => incident.status === "Resolved"
          ).length;
          const pendingCount = allIncidents.filter(
            (incident) => incident.status === "Unresolved" && incident.assigned_agent === "N/A"
          ).length;

          setStats({ active: activeCount, resolved: resolvedCount, pending: pendingCount });

          // Sort incidents by time in descending order (most recent first)
          const sortedIncidents = allIncidents.sort((a, b) => new Date(b.time) - new Date(a.time));
          setIncidents(sortedIncidents);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  useEffect(() => {
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 10,
      });

      // Add markers for each incident
      incidents.forEach((incident) => {
        if (incident.location && incident.location.latitude && incident.location.longitude) {
          new window.google.maps.Marker({
            position: {
              lat: parseFloat(incident.location.latitude),
              lng: parseFloat(incident.location.longitude),
            },
            map: map,
            title: `Incident: ${incident.type}`,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red marker icon
            },
          });
        }
      });
    };
  }, [incidents]); // Re-run the map when incidents are updated

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">Active: {stats.active}</div>
        <div className="stat">Resolved: {stats.resolved}</div>
        <div className="stat">Pending: {stats.pending}</div>
      </div>
      <div id="map" className="map" style={{ height: "500px", width: "100%" }}></div>
      <div className="recent-incidents">
  <h2>Recent Incidents</h2>
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Location</th>
          <th>Time</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assigned Agent</th>
        </tr>
      </thead>
      <tbody>
        {incidents.length > 0 ? (
          incidents.slice(0, incidents.length).map((incident, index) => (
            <tr key={index}>
              <td>{incident.id || "N/A"}</td>
              <td>{incident.type || "N/A"}</td>
              <td>
                {incident.location
                  ? `${incident.location.latitude}, ${incident.location.longitude}`
                  : "N/A"}
              </td>
              <td>{incident.time || "N/A"}</td>
              <td>{incident.priority || "N/A"}</td>
              <td>{incident.status || "N/A"}</td>
              <td>{incident.assigned_agent || "N/A"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No incidents found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}

export default Dashboard;