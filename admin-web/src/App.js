import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import IncidentManagement from "./pages/IncidentManagement/IncidentManagement";
import AgentMonitoring from "./pages/AgentMonitoring/AgentMonitoring";
import UserManagement from "./pages/UserManagement/UserManagement";
import Analytics from "./pages/Analytics/Analytics";
import SignIn from "./pages/SignIn/SignIn";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar onSignOut={handleSignOut} />}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <SignIn setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/incidents"
              element={isAuthenticated ? <IncidentManagement /> : <Navigate to="/" />}
            />
            <Route
              path="/agents"
              element={isAuthenticated ? <AgentMonitoring /> : <Navigate to="/" />}
            />
            <Route
              path="/users"
              element={isAuthenticated ? <UserManagement /> : <Navigate to="/" />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated ? <Analytics /> : <Navigate to="/" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
