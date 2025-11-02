/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.5 – Step 2C (Safari-Safe Role Filter Integration)
   ----------------------------------------------------------------------
   Uses div-based RoleFilterBar to ensure consistent blue active state.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [activeRole, setActiveRole] = useState("Solo");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("governanceSummary")) || [];
    setGovernanceData(storedData);

    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setActiveRole(savedRole);
  }, []);

  return (
    <div className="governance-summary">
      <header className="governance-summary-header">
        <h1>Governance Summary Dashboard</h1>
      </header>

      <RoleFilterBar onRoleChange={setActiveRole} />

      <section className="governance-summary-content">
        {governanceData.length === 0 ? (
          <p className="empty-state">No governance data available.</p>
        ) : (
          <div className="governance-cards">
            {governanceData.map((item, index) => (
              <div key={index} className="governance-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>{item.category}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
