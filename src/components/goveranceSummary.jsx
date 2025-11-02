/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.3 Skeleton Layout
   ====================================================================== */
import "./GovernanceSummary.css";

import React, { useState } from "react";
import MetricCard from "./MetricCard";
import RoleSummaryBar from "./RoleSummaryBar";
import ActivityStream from "./ActivityStream";
import GovernanceFilters from "./GovernanceFilters";

export default function GovernanceSummary() {
  const [lastUpdated] = useState("02 Nov 2025 09:45");

  const dummyMetrics = [
    { type: "Change Control", count: 7, lastEntryTime: "09:42" },
    { type: "Risk", count: 3, lastEntryTime: "09:40" },
    { type: "Issue", count: 8, lastEntryTime: "09:35" },
    { type: "Quality", count: 5, lastEntryTime: "09:30" },
    { type: "Template Review", count: 2, lastEntryTime: "09:25" },
  ];

  const dummyRoles = { admin: 24, pmo: 15, pm: 10, user: 6 };

  const dummyAudit = [
    { ts: "02 Nov 2025 09:18", user: "Admin JM", action: "Closed Risk R-024", type: "Risk", ref: "#R-024" },
    { ts: "02 Nov 2025 09:10", user: "PM AD", action: "Added Issue I-017", type: "Issue", ref: "#I-017" },
    { ts: "02 Nov 2025 09:05", user: "Admin JM", action: "Approved Template", type: "Template", ref: "#T-013" },
  ];

  return (
    <div className="governance-summary-container">
      <header className="gov-header">
        <h2>Governance Summary Dashboard</h2>
        <div className="gov-header-buttons">
          <button>⟳ Refresh</button>
          <button>⌄ Filter</button>
        </div>
      </header>

      <GovernanceFilters />

      <section className="metric-section">
        {dummyMetrics.map((m, i) => (
          <MetricCard key={i} type={m.type} count={m.count} lastEntryTime={m.lastEntryTime} />
        ))}
      </section>

      <RoleSummaryBar roleStats={dummyRoles} />

      <section className="activity-section">
        <h3>Latest Activity</h3>
        <ActivityStream auditEntries={dummyAudit} />
      </section>

      <footer className="gov-footer">
        Data updated {lastUpdated} · Source: Local Governance Store · 
        <button>Export CSV</button>
      </footer>
    </div>
  );
}
