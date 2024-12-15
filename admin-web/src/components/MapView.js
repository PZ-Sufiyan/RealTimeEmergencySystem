import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

const MapView = () => {
  const incidents = [
    { id: 1, lat: 51.505, lon: -0.09, type: 'Fire', description: 'Fire reported in building A' },
    { id: 2, lat: 51.515, lon: -0.1, type: 'Police', description: 'Police required in area B' },
  ];

  return (
    <div className="map-container">
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {incidents.map((incident) => (
          <Marker key={incident.id} position={[incident.lat, incident.lon]} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })}>
            <Popup>
              <h3>{incident.type}</h3>
              <p>{incident.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
