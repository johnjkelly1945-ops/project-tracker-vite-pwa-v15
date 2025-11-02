/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.5 – Step 3 (Role-Based Filtering Logic)
   ----------------------------------------------------------------------
   Displays governance data filtered by active user role.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [activeRole, setActiveRole] = useState("Solo");

  // Load base data once
  useEffect(() => {
    const storedData =
      JSON.parse(localStorage.getItem("governanceSummary")) || [];
    setGovernanceData(storedData);

    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setActiveRole(savedRole);
  }, []);

  // === Role Filter Logic ===
  const filteredData = governanceData.filter((item) => {
    if (activeRole === "Admin" || activeRole === "PMO" || activeRole === "Solo")
      return true;

    if (activeRole === "Project Manager") {
      // Example: item.projectManager or item.roleTags includes "PM"
      return item.roleTags?.includes("PM") || item.assignedRole === "PM";
    }

    if (activeRole === "Project User") {
      // Example: match by userId or roleTags includes "User"
      return item.roleTags?.includes("User") || item.assignedRole === "User";
    }

    return true;
  });

  return (
    <div className="governance-summary">
      <header className="governance-summary-header">
        <h1>Governance Summary Dashboard</h1>
      </header>

      <RoleFilterBar onRoleChange={setActiveRole} />

      <section className="governance-summary-content">
        {filteredData.length === 0 ? (
          <p className="empty-state">
            No governance data visible for the selected role.
          </p>
        ) : (
          <div className="governance-cards">
            {filteredData.map((item, index) => (
              <div key={index} className="governance-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>
                  {item.category} · Role: {item.assignedRole || "N/A"}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
