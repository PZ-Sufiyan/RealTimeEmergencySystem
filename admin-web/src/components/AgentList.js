import React from 'react';
import AgentCard from './AgentCard';

const AgentList = () => {
  const agents = [
    { id: 1, name: 'Agent 1', status: 'Online' },
    { id: 2, name: 'Agent 2', status: 'Offline' },
  ];

  return (
    <div className="agent-list">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentList;
