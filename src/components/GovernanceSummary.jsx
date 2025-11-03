/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.6 Step 1 – Project Grouping Layout
   ----------------------------------------------------------------------
   Groups governance items by projectId with collapsible sections.
   Maintains role badges, personnel linkage, and filters.
   ====================================================================== */

import React, { useEffect, useState } from "react";
import "./GovernanceSummary.css";
import RoleFilterBar from "./RoleFilterBar";
import usePersonnelData from "../hooks/usePersonnelData";

export default function GovernanceSummary() {
  const [governanceData, setGovernanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeRole, setActiveRole] = useState("All");
  const [openProjects, setOpenProjects] = useState({});
  const personnel = usePersonnelData();

  // --- Seed grouped demo data ---
  useEffect(() => {
    const sampleGovernance = [
      {
        id: 1,
        projectId: "P-001",
        projectName: "Project Orion",
        title: "Budget Approval",
        description: "Finance committee sign-off required.",
        roleTags: ["PMO"],
        assignedTo: "David Ng",
        status: "Pending",
        timestamp: "2026-01-12 09:00",
      },
      {
        id: 2,
        projectId: "P-001",
        projectName: "Project Orion",
        title: "Feasibility Report",
        description: "Manager to upload feasibility study.",
        roleTags: ["Manager"],
        assignedTo: "Maria Santos",
        status: "In Progress",
        timestamp: "2026-01-12 09:10",
      },
      {
        id: 3,
        projectId: "P-002",
        projectName: "Project Atlas",
        title: "Stakeholder Review",
        description: "User to gather stakeholder feedback.",
        roleTags: ["User"],
        assignedTo: "Liam Turner",
        status: "Open",
        timestamp: "2026-01-12 09:15",
      },
      {
        id: 4,
        projectId: "P-002",
        projectName: "Project Atlas",
        title: "Audit Trail Verification",
        description: "Admin verifies audit log consistency.",
        roleTags: ["Admin"],
        assignedTo: "Alice Robertson",
        status: "Complete",
        timestamp: "2026-01-12 09:20",
      },
    ];
    localStorage.setItem("governanceSummary", JSON.stringify(sampleGovernance));
    setGovernanceData(sampleGovernance);
  }, []);

  // --- Role filter ---
  useEffect(() => {
    if (activeRole === "All") setFilteredData(governanceData);
    else {
      setFilteredData(
        governanceData.filter(
          (item) => item.roleTags && item.roleTags.includes(activeRole)
        )
      );
    }
  }, [activeRole, governanceData]);

  const findPersonnel = (assignedTo) =>
    personnel.find((p) => p.name === assignedTo);

  // --- Group by projectId ---
  const grouped = filteredData.reduce((acc, item) => {
    const key = item.projectId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const toggleProject = (id) =>
    setOpenProjects((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="governance-summary">
      <h2 className="gov-header">Governance Summary – Project Grouping</h2>
      <RoleFilterBar activeRole={activeRole} setActiveRole={setActiveRole} />

      {Object.entries(grouped).map(([projectId, items]) => {
        const projectName = items[0]?.projectName || projectId;
        const isOpen = openProjects[projectId] ?? true;
        return (
          <section key={projectId} className="gov-project-section">
            <div
              className="gov-project-header"
              onClick={() => toggleProject(projectId)}
            >
              <span className="gov-project-id">{projectName}</span>
              <span className="gov-toggle">{isOpen ? "−" : "+"}</span>
            </div>

            {isOpen && (
              <div className="gov-card-container">
                {items.map((item) => {
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
            )}
          </section>
        );
      })}
    </div>
  );
}
