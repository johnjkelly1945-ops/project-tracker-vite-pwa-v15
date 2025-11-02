/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 A.4 – Scroll Wrapper Integration (Safari Scroll Fix)
   ----------------------------------------------------------------------
   Adds internal scroll-wrapper div to ensure vertical scrolling works
   even when Safari ignores 100vh containers.
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

  const handleRefresh = () => {
    try {
      setMetrics(getGovernanceMetrics(GovernanceStore));
      setRoles(getRoleVisibilityStats(GovernanceStore));
      setAudits(getRecentAuditEntries(5, AuditTrailStore));
      setTimestamp(new Date().toLocaleString());
    } catch (err) {
      console.error("Governance refresh error:", err);
    }
  };

  useEffect(() => {
    handleRefresh();
    const timer = setInterval(() => {
      handleRefresh();
      const pulse = document.querySelector(".pulse-indicator");
      if (pulse) {
        pulse.classList.add("pulse-active");
        setTimeout(() => pulse.classList.remove("pulse-active"), 1200);
      }
    }, 300000); // every 5 minutes
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="governance-summary">
      {/* ===== Header with controls ===== */}
      <div className="governance-header">
        <div className="header-left">
          <h1>Governance Summary Dashboard</h1>
          <div className="update-time">Last updated: {timestamp}</div>
        </div>

        <div className="header-controls">
          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Refresh
          </button>
          <div className="pulse-indicator" title="Auto-update active"></div>
        </div>
      </div>

      {/* ===== Scrollable Wrapper ===== */}
      <div className="scroll-wrapper">
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
                <span className="timestamp">
                  {new Date(a.timestampCreated).toLocaleString()}
                </span>{" "}
                — <span className="user">{a.user}</span>{" "}
                <span className="action">{a.action}</span>{" "}
                (<span className="type">{a.governanceType}</span>,{" "}
                <span className="ref">{a.refID}</span>)
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   Notes:
   • Internal .scroll-wrapper ensures Safari scrolling always works.
   • All styling hooks preserved from GovernanceSummary.css.
   • Header remains at top; content scrolls independently below.
   ====================================================================== */
