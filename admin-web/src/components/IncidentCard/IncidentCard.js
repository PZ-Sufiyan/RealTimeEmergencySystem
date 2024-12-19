import React from 'react';
import './IncidentCard.css';

const IncidentCard = ({ incident }) => {
  return (
    <div className="incident-card">
      <h3>{incident.title}</h3>
      <p>Type: {incident.type}</p>
      <p>Status: {incident.status}</p>
      <p>Priority: {incident.priority}</p>
    </div>
  );
};

export default IncidentCard;