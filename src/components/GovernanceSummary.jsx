/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.3C – Data Integration (Styled Layout)
   ----------------------------------------------------------------------
   Combines Governance metrics, role summary, and recent audit stream
   into a unified dashboard layout.
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { getGovernanceMetrics, getRoleVisibilityStats } from "../utils/GovernanceUtils";
import { getRecentAuditEntries } from "../utils/AuditUtils";
import GovernanceStore from "../data/GovernanceStore";
import AuditTrailStore from "../data/AuditTrailStore";
import "./GovernanceSummary.css";
import RoleSummaryBar from "./RoleSummaryBar";

export default function GovernanceSummary() {
  const [metrics, setMetrics] = useState({});
  const [roles, setRoles] = useState({});
  const [audits, setAudits] = useState([]);
  const [timestamp, setTimestamp] = useState("");

  // On mount: compute summary data
  useEffect(() => {
    setMetrics(getGovernanceMetrics(GovernanceStore));
    setRoles(getRoleVisibilityStats(GovernanceStore));
    setAudits(getRecentAuditEntries(5, AuditTrailStore));
    setTimestamp(new Date().toLocaleString());
  }, []);

  return (
    <div className="governance-summary">
      {/* ===== Header ===== */}
      <div className="governance-header">
        <h1>Governance Summary Dashboard</h1>
        <div className="update-time">Last updated: {timestamp}</div>
      </div>

      {/* ===== Metrics Grid ===== */}
      <div className="metrics-grid">
        {Object.entries(metrics).map(([type, info]) => (
          <div key={type} className="metric-card">
            <div className="metric-title">{type}</div>
            <div className="metric-count">{info.count}</div>
            <div className="metric-last">
              Last entry <strong>{info.lastEntryTime}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Role Summary ===== */}
      <div className="roles-section">
        <RoleSummaryBar roles={roles} />
      </div>

      {/* ===== Activity Stream ===== */}
      <div className="activity-section">
        <h3>Recent Governance Activity</h3>
        {audits.length === 0 ? (
          <div className="activity-line">No recent activity.</div>
        ) : (
          audits.map((a) => (
            <div key={a.id} className="activity-line">
              <span className="timestamp">{new Date(a.timestampCreated).toLocaleString()}</span>
              {" — "}
              <span className="user">{a.user}</span> <span className="action">{a.action}</span>{" "}
              (<span className="type">{a.governanceType}</span>,{" "}
              <span className="ref">{a.refID}</span>)
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ======================================================================
   Notes:
   • Fully styled using GovernanceSummary.css.
   • Safe with missing data (all utilities use fallbacks).
   • Displays metrics, roles, and recent audit entries.
   ====================================================================== */
