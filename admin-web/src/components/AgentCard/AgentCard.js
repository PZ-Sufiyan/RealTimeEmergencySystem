import React from 'react';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
  return (
    <div className="agent-card">
      <h3>{agent.name}</h3>
      <p>Status: {agent.status}</p>
      <p>Location: {agent.location}</p>
    </div>
  );
};

export default AgentCard;