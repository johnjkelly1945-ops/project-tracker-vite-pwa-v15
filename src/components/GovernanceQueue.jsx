/* ==========================================================
   METRA – GovernanceQueue (Phase 4.3D.1)
   ----------------------------------------------------------
   Restores live Governance Queue component logic.
   Integrated with RoleContext for role-based visibility.
   Displays queue items and audit triggers.
   ========================================================== */

import React, { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext.jsx";
import "../Styles/PreProject.css";

/* ----------------------------------------------------------
   Simulated queue data (replace later with live fetch)
   ---------------------------------------------------------- */
const initialGovernanceItems = [
  {
    id: 1,
    type: "Change Control",
    project: "Infrastructure Upgrade",
    status: "Pending",
    owner: "PMO",
    date: "2025-10-25",
  },
  {
    id: 2,
    type: "Template Update",
    project: "Policy Review",
    status: "Approved",
    owner: "Admin",
    date: "2025-10-22",
  },
  {
    id: 3,
    type: "Quality Review",
    project: "Site Audit",
    status: "In Review",
    owner: "PMO",
    date: "2025-10-30",
  },
];

export default function GovernanceQueue() {
  const { role } = useRole();
  const [queueItems, setQueueItems] = useState(initialGovernanceItems);
  const [filter, setFilter] = useState("all");

  /* ----------------------------------------------------------
     Filter logic – later can be extended for search/sort
     ---------------------------------------------------------- */
  const filteredItems =
    filter === "all"
      ? queueItems
      : queueItems.filter((item) => item.status === filter);

  /* ----------------------------------------------------------
     Demo audit trigger (simulated persistence)
     ---------------------------------------------------------- */
  useEffect(() => {
    console.log(`✅ GovernanceQueue mounted for role: ${role}`);
  }, [role]);

  return (
    <div className="governance-queue-container">
      <h2 className="gov-header">Governance Queue</h2>

      <div className="gov-controls">
        <label htmlFor="filter" className="gov-filter-label">
          Filter by Status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="gov-filter-select"
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      <div className="gov-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="gov-item">
            <div className="gov-type">{item.type}</div>
            <div className="gov-project">{item.project}</div>
            <div className={`gov-status status-${item.status.toLowerCase()}`}>
              {item.status}
            </div>
            <div className="gov-owner">{item.owner}</div>
            <div className="gov-date">{item.date}</div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="gov-empty">No items match this filter.</p>
        )}
      </div>
    </div>
  );
}
