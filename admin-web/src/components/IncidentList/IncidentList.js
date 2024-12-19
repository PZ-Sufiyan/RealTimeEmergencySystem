import React from 'react';
import IncidentCard from '../IncidentCard/IncidentCard';
import './IncidentList.css';

const IncidentList = ({ incidents }) => {
  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
};

export default IncidentList;