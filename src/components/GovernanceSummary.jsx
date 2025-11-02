/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.5 – Step 4 (Data Mapping & Role-Tag Enrichment)
   ----------------------------------------------------------------------
   Seeds localStorage with sample Governance data containing role tags
   so that role-based filtering can be visually tested.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [activeRole, setActiveRole] = useState("Solo");

  // === Demo Governance Data ==================================================
  const demoData = [
    {
      title: "Budget Approval",
      description: "Finance committee sign-off required before project start.",
      category: "Finance",
      assignedRole: "PMO",
      assignedUser: "alice",
      projectId: "P-001",
      roleTags: ["PMO", "Admin"],
    },
    {
      title: "Feasibility Report",
      description: "Project Manager to upload feasibility study.",
      category: "Pre-Project",
      assignedRole: "Project Manager",
      assignedUser: "bob",
      projectId: "P-002",
      roleTags: ["PM", "User"],
    },
    {
      title: "Stakeholder Review",
      description: "Project User to gather stakeholder feedback.",
      category: "Engagement",
      assignedRole: "Project User",
      assignedUser: "carol",
      projectId: "P-002",
      roleTags: ["User"],
    },
    {
      title: "Audit Trail Verification",
      description: "Admin verifies audit log consistency.",
      category: "Governance",
      assignedRole: "Admin",
      assignedUser: "david",
      projectId: "SYS-01",
      roleTags: ["Admin"],
    },
  ];
  // ===========================================================================

  useEffect(() => {
    // Seed demo data to localStorage if none exists
    let stored = JSON.parse(localStorage.getItem("governanceSummary"));
    if (!stored || stored.length === 0) {
      localStorage.setItem("governanceSummary", JSON.stringify(demoData));
      stored = demoData;
    }
    setGovernanceData(stored);

    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setActiveRole(savedRole);
  }, []);

  // === Role-Based Filtering ==================================================
  const filteredData = governanceData.filter((item) => {
    if (activeRole === "Admin" || activeRole === "PMO" || activeRole === "Solo")
      return true;

    if (activeRole === "Project Manager") {
      return (
        item.roleTags?.includes("PM") ||
        item.assignedRole === "Project Manager"
      );
    }

    if (activeRole === "Project User") {
      return (
        item.roleTags?.includes("User") ||
        item.assignedRole === "Project User"
      );
    }

    return true;
  });
  // ===========================================================================

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
                  {item.category} · Role: {item.assignedRole}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
