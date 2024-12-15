import React from 'react';
import IncidentCard from './IncidentCard';

const IncidentList = () => {
  const incidents = [
    { id: 1, type: 'Fire', description: 'Fire in building A', status: 'Pending' },
    { id: 2, type: 'Police', description: 'Assault reported', status: 'In Progress' },
  ];

  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
};

export default IncidentList;
