import React from 'react';
import AgentCard from '../AgentCard/AgentCard';
import './AgentList.css';

const AgentList = ({ agents }) => {
  return (
    <div className="agent-list">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentList;