import React from 'react';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const notifications = [
    'New incident reported in Area A',
    'Agent 1 has accepted incident 1',
  ];

  return (
    <div className="notification-panel">
      <h4>Notifications</h4>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
