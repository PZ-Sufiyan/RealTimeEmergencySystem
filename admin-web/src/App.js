import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import IncidentManagement from './pages/IncidentManagement';
import AgentManagement from './pages/AgentManagement';
import Analytics from './pages/Analytics';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Routes> {/* Updated to use Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/incidents" element={<IncidentManagement />} />
              <Route path="/agents" element={<AgentManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
