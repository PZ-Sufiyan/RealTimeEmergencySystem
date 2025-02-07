import React, { useState, useEffect } from "react";
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

  const fetchIncidents = async () => {
    try {
      const response = await axios.get("http://192.168.1.115:8000/incidents/");
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
      const response = await axios.get("http://192.168.1.115:8000/agents");
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

  const assignAgent = async (incidentId, agentId) => {
    try {
      // Make a POST request to update the assigned agent in the database
      await axios.post("http://192.168.1.115:8000/assign-agent", {
        incident_id: incidentId,
        assigned_agent: agentId, // Use agent_id here
      });

      // Update agent status to "occupied"
      await axios.post("http://192.168.1.115:8000/update-agent-status", {
        agent_id: agentId, // Use agent_id here
        status: "occupied",
      });

      // Update the incidents state directly to reflect the assigned agent
      setIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === incidentId ? { ...incident, assigned_agent: agentId } : incident
        )
      );

      // Reload the agents list to reflect the agent status update
      fetchAgents();
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  const markResolved = async (incidentId) => {
    try {
      // Make a POST request to update the status in the database
      await axios.post("http://192.168.1.115:8000/update-status", {
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
        await axios.post("http://192.168.1.115:8000/update-agent-status", {
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
                  assignAgentMap[incident.assigned_agent] // Display the agent's name using the agent ID
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
              <td>{incident.status}</td>
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
  );
}

export default IncidentManagement;