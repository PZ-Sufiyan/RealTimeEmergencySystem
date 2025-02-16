import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import axios from "axios";
import "./IncidentManagement.css";

function IncidentManagement() {
  const [filter, setFilter] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignagents, setAssignAgents] = useState([]);
  const [agentMap, setAgentMap] = useState({});
  const [assignAgentMap, setAssignAgentMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [address, setAddress] = useState("Fetching address...");


   const uri ="https://alert-system-fastapi-8749c7285c49.herokuapp.com";

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${uri}/incidents/`);
      const data = response.data.incidents;
      const unresolvedIncidents = Object.values(data).filter(
        (incident) => incident.status === "Unresolved"
      );
      setIncidents(unresolvedIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${uri}/agents`);
      const allAgents = Object.values(response.data.agents);
      setAssignAgents(allAgents);
      const assignAgentMap = allAgents.reduce((map, agent) => {
        map[agent.id] = agent.name;
        return map;
      }, {});
      setAssignAgentMap(assignAgentMap);

      const onlineAgents = allAgents.filter((agent) => agent.status === "online");
      setAgents(onlineAgents);

      // Create a map of agent_id to agent name for easy lookup
      const agentMap = onlineAgents.reduce((map, agent) => {
        map[agent.id] = agent.name;
        return map;
      }, {});
      setAgentMap(agentMap);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchAgents();
  }, []);
  
  const getAddress = async (latitude, longitude) => {
    const API_KEY = "AIzaSyCuKvOfI3PU7PBDkAOK-3zFTiriJUOhyTQ"; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const address = response.data.results[0]?.formatted_address;
            return address || "Unknown Location";
        } else {
            console.error("Geocoding API Error:", response.data);
            return "Unknown Location";
        }
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Unknown Location";
    }
};

  const assignAgent = async (incidentId, agentId) => {
    try {
      // Assign agent to incident
      await axios.post(`${uri}/assign-agent`, {
        incident_id: incidentId,
        assigned_agent: agentId,
      });
  
      // Update agent status to "occupied"
      await axios.post(`${uri}/update-agent-status`, {
        agent_id: agentId,
        status: "occupied",
      });
  
      
      const db = getDatabase();
      const agentResponse = await get(ref(db, `users/${agentId}`));
      if (agentResponse.exists()) {
            const agentData = agentResponse.val();
            const agentFcmToken = agentData?.FCM;
            const agentName = agentData?.name;
            const agentContact = agentData?.phone;

            console.log("Agent Data:", agentData);
            console.log("Agent FCM Token:", agentFcmToken);
            console.log("Agent Name:", agentName);
            console.log("Agent Contact Number:", agentContact)
        const incident = incidents.find((incident) => incident.id === incidentId);
        const incidentAddress = await getAddress(incident.location.latitude, incident.location.longitude);
        // Send notification through FastAPI
        await axios.post(`${uri}/send-notification-agent/`, {
          fcm_token: agentFcmToken,
          itype: incident.type,
          location: incidentAddress,
        });
        const userTokenResponse = await get(ref(db, `users/${incident.user_id}/FCM`));
       
        const userFcmToken = userTokenResponse.val();
        console.log("User FCM Token:", userFcmToken);
        console.log("Agent name:", agentResponse.name);
        console.log("Agent Contact Number:", agentResponse.phone);
        await axios.post(`${uri}/send-notification-user/`, {
          fcm_token: userFcmToken,
          agentName: agentName,
          agentContact: agentContact,
        });
      } else {
        console.error("FCM Token not found for agent:", agentId);
      }
  
  
  
      console.log("Notification sent successfully.");
  
      // Update UI to reflect assignment
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === incidentId ? { ...incident, assigned_agent: agentId } : incident
        )
      );
  
      // Reload agents to reflect updated status
      fetchAgents();
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  const markResolved = async (incidentId) => {
    try {
      // Make a POST request to update the status in the database
      await axios.post(`${uri}/update-status`, {
        incident_id: incidentId,
        status: "Resolved",
      });

      // Update the local state to reflect the status change
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === incidentId ? { ...incident, status: "Resolved" } : incident
        )
      );

      // Find the assigned agent for the resolved incident
      const resolvedIncident = incidents.find((incident) => incident.id === incidentId);
      const assignedAgentId = resolvedIncident?.assigned_agent;

      // If the incident had an agent, update their status back to "online"
      if (assignedAgentId) {
        await axios.post(`${uri}/update-agent-status`, {
          agent_id: assignedAgentId, // Use agent_id here
          status: "online",
        });
      }

      // Reload the incidents and agents after resolving the incident
      fetchIncidents();
      fetchAgents();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredIncidents = incidents.filter((incident) =>
    
    [incident.type, incident.time, incident.priority]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (

    <div className="incident-management">
  <h1>Incident Management</h1>
  
  <div className="controls">
    <input
      type="text"
      placeholder="Search incidents..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-box"
    />
  </div>

  <div className="table-container">
    <table className="incident-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Location</th>
          <th>Time</th>
          <th>Priority</th>
          <th>Assigned Agent</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredIncidents.map((incident) => (
          <tr key={incident.id}>
            <td>{incident.id}</td>
            <td>{incident.type}</td>
            <td>
              Latitude: {incident.location.latitude}, Longitude: {incident.location.longitude}
            </td>
            <td>{new Date(incident.time).toLocaleString()}</td>
            <td>{incident.priority}</td>
            <td>
              {incident.assigned_agent !== "N/A" ? (
                assignAgentMap[incident.assigned_agent]
              ) : (
                <select
                  onChange={(e) => assignAgent(incident.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Assign Agent
                  </option>
                  {agents.length > 0 ? (
                    agents.map((agent, index) => (
                      <option key={index} value={agent.id}>
                        {agent.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No Agents Available
                    </option>
                  )}
                </select>
              )}
            </td>
            <td className={incident.status === "Resolved" ? "resolved-text" : "unresolved-text"}>
              {incident.status}
            </td>
            <td>
              {incident.status === "Unresolved" && (
                <button className="resolve-button" onClick={() => markResolved(incident.id)}>
                  Mark Resolved
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default IncidentManagement;