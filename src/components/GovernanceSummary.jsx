/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.5 Step 6 – Personnel Link Integration
   ----------------------------------------------------------------------
   Adds live personnel linkage, role badges, and email line.
   Includes seeded governance data aligned to personnel list.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";
import usePersonnelData from "../hooks/usePersonnelData";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeRole, setActiveRole] = useState("All");

  // Shared personnel data hook
  const personnel = usePersonnelData();

  /* ---------------------------------------------------------------
     Seed local governance data for Step 6 demo.
     These entries align with the mock personnel names.
     --------------------------------------------------------------- */
  useEffect(() => {
    const sampleGovernance = [
      {
        id: 1,
        title: "Budget Approval",
        description: "Finance committee sign-off required before project start.",
        roleTags: ["PMO"],
        assignedTo: "David Ng",
        status: "Pending",
        timestamp: "2025-11-03 09:30",
      },
      {
        id: 2,
        title: "Feasibility Report",
        description: "Project Manager to upload feasibility study.",
        roleTags: ["Manager"],
        assignedTo: "Maria Santos",
        status: "In Progress",
        timestamp: "2025-11-03 09:31",
      },
      {
        id: 3,
        title: "Stakeholder Review",
        description: "Project User to gather stakeholder feedback.",
        roleTags: ["User"],
        assignedTo: "Liam Turner",
        status: "Open",
        timestamp: "2025-11-03 09:32",
      },
      {
        id: 4,
        title: "Audit Trail Verification",
        description: "Admin verifies audit log consistency.",
        roleTags: ["Admin"],
        assignedTo: "Alice Robertson",
        status: "Complete",
        timestamp: "2025-11-03 09:33",
      },
    ];

    localStorage.setItem("governanceSummary", JSON.stringify(sampleGovernance));
    setGovernanceData(sampleGovernance);
  }, []);

  // Filter logic by role
  useEffect(() => {
    if (activeRole === "All") {
      setFilteredData(governanceData);
    } else {
      const result = governanceData.filter(
        (item) => item.roleTags && item.roleTags.includes(activeRole)
      );
      setFilteredData(result);
    }
  }, [activeRole, governanceData]);

  // Match governance entries to personnel
  const findPersonnel = (assignedTo) =>
    personnel.find((p) => p.name === assignedTo);

  /* ---------------------------------------------------------------
     Render Section
     --------------------------------------------------------------- */
  return (
    <div className="governance-summary">
      <h2 className="gov-header">Governance Summary Dashboard</h2>

      <RoleFilterBar activeRole={activeRole} setActiveRole={setActiveRole} />

      <div className="gov-card-container">
        {filteredData.map((item) => {
          const person = findPersonnel(item.assignedTo);
          return (
            <div className="gov-card" key={item.id}>
              <div className="gov-card-header">
                <span
                  className={`role-badge role-${person?.role?.toLowerCase() || "none"}`}
                >
                  {person?.role || "Unassigned"}
                </span>
                <h3>{item.title}</h3>
              </div>

              <p className="gov-description">{item.description}</p>

              {person && (
                <div className="gov-personnel">
                  <span className="gov-person-name">{person.name}</span>
                  <span className="gov-person-email">{person.email}</span>
                </div>
              )}

              <div className="gov-meta">
                <span className="gov-status">{item.status}</span>
                <span className="gov-timestamp">{item.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
