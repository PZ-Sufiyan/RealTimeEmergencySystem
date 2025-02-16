import React, { useEffect, useState } from "react";
import "./Analytics.css";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const uri = "https://alert-system-fastapi-8749c7285c49.herokuapp.com";

const Analytics = () => {
  const [incidents, setIncidents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [map, setMap] = useState(null);

  // Fetch incident data
  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${uri}/incidents`);
      const incidentData = response.data.incidents || {};
      setIncidents(Object.values(incidentData));
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${uri}/agents`);
      const agentData = response.data.agents || {};
      setAgents(Object.values(agentData));
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // Initialize Google Maps Heatmap
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=visualization`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("heatmap"),
        {
          center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
          zoom: 5,
        }
      );
      setMap(mapInstance);
    };
  }, []);

  // Update Heatmap Layer
  useEffect(() => {
    if (map && incidents.length > 0) {
      const heatmapData = incidents
        .filter((incident) => incident.location?.latitude && incident.location?.longitude)
        .map((incident) =>
          new window.google.maps.LatLng(
            parseFloat(incident.location.latitude),
            parseFloat(incident.location.longitude)
          )
        );

      new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 30, // Adjust the heat intensity
        opacity: 0.6,
        gradient: ["rgba(255, 0, 0, 0)", "rgba(255, 0, 0, 1)"], // Red for high density
      });
    }
  }, [map, incidents]);

  // Filter incidents by status
  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(
    (incident) => incident.status === "Unresolved"
  ).length;
  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "Resolved"
  ).length;
  const onlineAgents = agents.length;

  // Get recent incidents count
  const getRecentCounts = (days) => {
    const today = new Date();
    return incidents.filter((incident) => {
      const incidentDate = new Date(incident.time); // Use incident.time instead of incident.timestamp
      const diffInDays = (today - incidentDate) / (1000 * 60 * 60 * 24);
      return diffInDays <= days;
    }).length;
  };
  

  // Bar Chart Data (Recent Day, Week, Month)
  const totalIncidentsData = {
    labels: ["Recent Day", "Recent Week", "Recent Month"],
    datasets: [
      {
        label: "Total Incidents",
        data: [getRecentCounts(1), getRecentCounts(7), getRecentCounts(30)],
        backgroundColor: "#3498db",
      },
    ],
  };

  // Pie Chart Data (Incident Type Distribution)
  const incidentTypes = incidents.reduce((acc, incident) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1;
    return acc;
  }, {});

  const incidentTypeData = {
    labels: Object.keys(incidentTypes),
    datasets: [
      {
        label: "Incident Types",
        data: Object.values(incidentTypes),
        backgroundColor: ["#FF5733", "#33A8FF", "#FFB233", "#8D33FF", "#2ECC71"],
      },
    ],
  };

  useEffect(() => {
    fetchIncidents();
    fetchAgents();
  }, []);

  return (
    <div className="analytics">
      <h1 className="analytics-title">Analytics & Reports</h1>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Incidents</h3>
          <p>{totalIncidents}</p>
        </div>
        <div className="stat-box">
          <h3>Active Incidents</h3>
          <p>{activeIncidents}</p>
        </div>
        <div className="stat-box">
          <h3>Resolved Incidents</h3>
          <p>{resolvedIncidents}</p>
        </div>
        <div className="stat-box">
          <h3>Online Agents</h3>
          <p>{onlineAgents}</p>
        </div>
      </div>

      <div className="graph-row">
        <div className="analytics-section small-chart">
          <h2>Total Incidents Reported</h2>
          <Bar data={totalIncidentsData} />
        </div>

        <div className="analytics-section small-chart">
          <h2>Incident Breakdown by Type</h2>
          <Pie data={incidentTypeData} />
        </div>
      </div>

      <div className="heatmap">
        <h2>Incident Locations Heatmap</h2>
        <div id="heatmap" className="heatmap-container"></div>
      </div>
    </div>
  );
};

export default Analytics;
