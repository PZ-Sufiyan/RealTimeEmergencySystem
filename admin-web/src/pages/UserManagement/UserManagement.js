import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const uri ="https://alert-system-fastapi-8749c7285c49.herokuapp.com";

  // Fetch users from Firebase on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${uri}/type_users`); // Change URL as needed
        if (response.data && response.data.users) {
          setUsers(Object.values(response.data.users)); // Ensure users is an array
        } else {
          setUsers([]); // Fallback to an empty array if no users are found
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Fallback to an empty array in case of an error
      }
    };

    fetchUsers();
  }, []);

  // Toggle user status between Active/Inactive
  // Toggle user status between Active/Inactive and update the API
const toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === "active" ? "deactive" : "active";
  
  try {
    // Call the API to update the status
    await axios.post(`${uri}/update-user-status`, {
      user_id: id,
      status: newStatus,
    });

    // Update the local state after a successful API call
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    console.log(`Status updated to ${newStatus} for user with ID: ${id}`);
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
};


  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.phone]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="user-management">
      <h1>User Management</h1>

      {/* Stylish Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search user by name, email, or phone..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>
<div className="table-container">
  <table className="user-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Status</th>
        <th>Action</th>
        <th>View Details</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.length > 0 ? (
        filteredUsers.slice(0, 10).map((user, index) => (
          <tr key={index}>
            <td>{user.id || "N/A"}</td>
            <td>{user.name || "N/A"}</td>
            <td>{user.email || "N/A"}</td>
            <td>{user.phone || "N/A"}</td>
            <td>{user.status || "inactive"}</td>
            <td>
              <button
                className="status-button"
                onClick={() => toggleStatus(user.id, user.status)}
              >
                {user.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </td>
            <td className="action-buttons">
              <button
                className="view-button"
                onClick={() => setSelectedUser(user)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">No users found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Stylish User Details Popup */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedUser(null)}>
              &times;
            </span>
            <h2>User Details</h2>
            <div className="user-details">
              <p><strong>Name:</strong> {selectedUser.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
              <p><strong>Status:</strong> {selectedUser.status || "N/A"}</p>
              <h3>Emergency Contacts</h3>
              <ul className="emergency-contact-list">
                {selectedUser.emergencyContacts?.map((contact, index) => (
                  <li key={index}>
                    <strong>{contact.name || "N/A"}:</strong> {contact.phone || "N/A"}
                  </li>
                )) || <li>No emergency contacts available.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
