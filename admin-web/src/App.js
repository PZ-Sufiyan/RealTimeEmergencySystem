import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import IncidentManagement from "./pages/IncidentManagement/IncidentManagement";
import AgentMonitoring from "./pages/AgentMonitoring/AgentMonitoring";
import UserManagement from "./pages/UserManagement/UserManagement";
import Analytics from "./pages/Analytics/Analytics";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents" element={<IncidentManagement />} />
            <Route path="/agents" element={<AgentMonitoring />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;