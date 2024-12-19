import React from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="notification-panel">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;