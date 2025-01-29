import React, { useEffect } from "react";
import "./Analytics.css";
import { Bar, Pie } from "react-chartjs-2";
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

const Analytics = () => {
  // Static Data for Total Incidents (Daily, Weekly, Monthly)
  const totalIncidentsData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Total Incidents",
        data: [12, 78, 240], // Example data
        backgroundColor: "#3498db",
      },
    ],
  };

  // Static Data for Incident Breakdown by Type
  const incidentTypeData = {
    labels: ["Fire", "Medical", "Theft", "Accident", "Other"],
    datasets: [
      {
        label: "Incidents Count",
        data: [15, 20, 10, 8, 5], // Example counts
        backgroundColor: ["#FF5733", "#33A8FF", "#FFB233", "#8D33FF", "#2ECC71"],
      },
    ],
  };

  // Google Maps Heatmap Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=visualization`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("heatmap"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco
        zoom: 5,
      });

      const heatmapData = [
        { location: new window.google.maps.LatLng(37.7749, -122.4194), weight: 3 },
        { location: new window.google.maps.LatLng(34.0522, -118.2437), weight: 5 },
        { location: new window.google.maps.LatLng(40.7128, -74.006), weight: 2 },
      ];

      new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData.map((data) => data.location),
        map: map,
      });
    };
  }, []);

  return (
    <div className="analytics">
      <h1 className="analytics-title">Analytics & Reports</h1>

      {/* Real-Time Statistics */}
      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Incidents</h3>
          <p>240</p>
        </div>
        <div className="stat-box">
          <h3>Active Incidents</h3>
          <p>12</p>
        </div>
        <div className="stat-box">
          <h3>Resolved Incidents</h3>
          <p>228</p>
        </div>
        <div className="stat-box">
          <h3>Online Agents</h3>
          <p>8</p>
        </div>
      </div>

      {/* Graphs in Same Row */}
      <div className="graph-row">
        {/* Total Incidents Reported */}
        <div className="analytics-section small-chart">
          <h2>Total Incidents Reported</h2>
          <Bar data={totalIncidentsData} />
        </div>

        {/* Incident Breakdown by Type */}
        <div className="analytics-section small-chart">
          <h2>Incident Breakdown by Type</h2>
          <Pie data={incidentTypeData} />
        </div>
      </div>

      {/* Incident Locations Heatmap */}
      <div className="analytics-section">
        <h2>Incident Locations Heatmap</h2>
        <div id="heatmap" className="heatmap-container"></div>
      </div>
    </div>
  );
};

export default Analytics;
