import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/incidents", label: "Incidents", icon: "⚠" },
    { path: "/agents", label: "Agents", icon: "👮" },
    { path: "/users", label: "Users", icon: "👤" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
