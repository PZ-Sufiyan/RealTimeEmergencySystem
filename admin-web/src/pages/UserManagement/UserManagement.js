import React, { useState } from "react";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "123-456-7890", status: "Active" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com", phone: "987-654-3210", status: "Inactive" },
    { id: 3, name: "Alice Johnson", email: "alicejohnson@example.com", phone: "555-666-7777", status: "Active" },
  ]);

  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user
      )
    );
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;