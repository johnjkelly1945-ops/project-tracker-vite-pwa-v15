/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.5 – Step 5 (Personnel Integration Prep)
   ----------------------------------------------------------------------
   Links Governance Summary demo items to mock Personnel records.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [personnelData, setPersonnelData] = useState([]);
  const [activeRole, setActiveRole] = useState("Solo");

  // === Mock Personnel Data ============================================
  const demoPersonnel = [
    { userId: "alice", displayName: "Alice Grant", role: "PMO", projectAssignments: ["P-001"] },
    { userId: "bob", displayName: "Bob Lang", role: "Project Manager", projectAssignments: ["P-002"] },
    { userId: "carol", displayName: "Carol West", role: "Project User", projectAssignments: ["P-002"] },
    { userId: "david", displayName: "David Stone", role: "Admin", projectAssignments: ["SYS-01"] },
  ];
  // ====================================================================

  // === Demo Governance Data ===========================================
  const demoGovernance = [
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
  // ====================================================================

  useEffect(() => {
    // Seed data once
    let storedGov = JSON.parse(localStorage.getItem("governanceSummary"));
    if (!storedGov || storedGov.length === 0) {
      localStorage.setItem("governanceSummary", JSON.stringify(demoGovernance));
      storedGov = demoGovernance;
    }
    setGovernanceData(storedGov);
    setPersonnelData(demoPersonnel);

    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setActiveRole(savedRole);
  }, []);

  // === Role-based filter ==============================================
  const filteredData = governanceData.filter((item) => {
    if (["Admin", "PMO", "Solo"].includes(activeRole)) return true;
    if (activeRole === "Project Manager")
      return item.roleTags?.includes("PM") || item.assignedRole === "Project Manager";
    if (activeRole === "Project User")
      return item.roleTags?.includes("User") || item.assignedRole === "Project User";
    return true;
  });
  // ====================================================================

  // === Helper: find personnel name ====================================
  const getUserDisplayName = (userId) => {
    const user = personnelData.find((u) => u.userId === userId);
    return user ? user.displayName : "Unassigned";
  };
  // ====================================================================

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
                <p className="assigned-user">
                  Assigned To: <strong>{getUserDisplayName(item.assignedUser)}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
