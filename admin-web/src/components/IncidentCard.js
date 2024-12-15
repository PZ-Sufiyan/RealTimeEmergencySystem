import React from 'react';
import './IncidentCard.css';

const IncidentCard = ({ incident }) => {
  return (
    <div className="incident-card">
      <h4>{incident.type}</h4>
      <p>{incident.description}</p>
      <span>Status: {incident.status}</span>
    </div>
  );
};

export default IncidentCard;
