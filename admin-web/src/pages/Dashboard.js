import React from 'react';
import MapView from '../components/MapView';
import NotificationPanel from '../components/NotificationPanel';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <MapView />
      <NotificationPanel />
    </div>
  );
};

export default Dashboard;
