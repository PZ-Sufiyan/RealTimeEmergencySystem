import React, { useState } from "react";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      emergencyContacts: [
        { name: "James Doe", phone: "987-654-3210" },
        { name: "Sarah Doe", phone: "456-789-1230" },
      ],
      password: "john@123",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "987-654-3210",
      emergencyContacts: [
        { name: "Emily Smith", phone: "654-321-0987" },
        { name: "Michael Smith", phone: "789-456-1235" },
      ],
      password: "jane@456",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alicejohnson@example.com",
      phone: "555-666-7777",
      emergencyContacts: [
        { name: "Mark Johnson", phone: "321-654-9870" },
        { name: "Olivia Johnson", phone: "555-123-6789" },
      ],
      password: "alice@789",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
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
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="status-button"
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </td>
              <td>
                <button
                  className="view-button"
                  onClick={() => setSelectedUser(user)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stylish User Details Popup */}
      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedUser(null)}>
              &times;
            </span>
            <h2>User Details</h2>
            <div className="user-details">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Password:</strong> {selectedUser.password}</p>
              <h3>Emergency Contacts</h3>
              <ul className="emergency-contact-list">
                {selectedUser.emergencyContacts.map((contact, index) => (
                  <li key={index}>
                    <strong>{contact.name}:</strong> {contact.phone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
