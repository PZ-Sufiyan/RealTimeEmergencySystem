import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import "./Dashboard.css";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ",
  authDomain: "elisasentry.firebaseapp.com",
  databaseURL: "https://elisasentry.firebaseio.com",
  projectId: "elisasentry",
  storageBucket: "elisasentry.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghij"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

function Dashboard() {
  const [stats, setStats] = useState({ active: 0, resolved: 0, pending: 0 });
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const db = getDatabase(firebaseApp);
    const incidentsRef = ref(db, "incidents");

    onValue(incidentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIncidents(Object.values(data));
        setStats({
          active: data.filter((incident) => incident.status === "Active").length,
          resolved: data.filter((incident) => incident.status === "Resolved").length,
          pending: data.filter((incident) => incident.status === "Pending").length,
        });
      }
    });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ&libraries=places`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Set a default center (San Francisco for example)
        zoom: 10,
      });
    };
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">Active: {stats.active}</div>
        <div className="stat">Resolved: {stats.resolved}</div>
        <div className="stat">Pending: {stats.pending}</div>
      </div>
      <div id="map" className="map"></div>
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
