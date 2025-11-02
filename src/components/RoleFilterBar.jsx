/* ======================================================================
   METRA – RoleFilterBar.jsx
   Phase 4.6 A.5 – Step 3 (Role Selection Logic)
   ----------------------------------------------------------------------
   Emits activeRole state changes upward for data filtering.
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "./GovernanceSummary.css";

export default function RoleFilterBar({ onRoleChange }) {
  const roles = ["Admin", "PMO", "Project Manager", "Project User", "Solo"];
  const [activeRole, setActiveRole] = useState("Solo");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole && roles.includes(savedRole)) {
      setActiveRole(savedRole);
      onRoleChange && onRoleChange(savedRole);
    }
  }, []);

  const handleSelect = (role) => {
    setActiveRole(role);
    localStorage.setItem("userRole", role);
    onRoleChange && onRoleChange(role);
  };

  return (
    <div className="role-filter-bar">
      {roles.map((role) => (
        <div
          key={role}
          className={`role-btn ${activeRole === role ? "active" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSelect(role)}
          onKeyDown={(e) => e.key === "Enter" && handleSelect(role)}
        >
          {role}
        </div>
      ))}
    </div>
  );
}
