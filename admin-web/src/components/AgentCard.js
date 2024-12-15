import React from 'react';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
  return (
    <div className="agent-card">
      <h4>{agent.name}</h4>
      <p>Status: {agent.status}</p>
    </div>
  );
};

export default AgentCard;
