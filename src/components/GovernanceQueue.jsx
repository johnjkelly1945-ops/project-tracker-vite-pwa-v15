/* =====================================================================
   METRA – GovernanceQueue.jsx
   Phase 4.6 A.2 · Filter & Badge Counter Fix (Live Count Refresh)
   ===================================================================== */

import React, { useState, useEffect } from "react";
import { getAllAuditEntries, formatLocalTime } from "../utils/AuditUtils";

export default function GovernanceQueue({ role }) {
  const [viewMode, setViewMode] = useState("all");
  const [grouped, setGrouped] = useState({});
  const [tick, setTick] = useState(0); // refresh trigger

  // --- Refresh grouped audit data ---
  const refresh = () => {
    const all = getAllAuditEntries();
    const sections = ["PreProject", "Change Control", "Risk", "Issue"];
    const result = {};

    sections.forEach((section) => {
      const entries = all.filter((e) => {
        const isGovRole = role === "Admin" || role === "PMO";
        const isEscalated =
          e.isEscalated === true ||
          e.user === "Admin" ||
          e.user === "PMO" ||
          (isGovRole && e.keyRef === section);
        return e.keyRef === section && isEscalated;
      });
      result[section] = entries.reverse();
    });
    setGrouped(result);
  };

  // --- Periodic refresh for live updates ---
  useEffect(() => {
    if (role === "Admin" || role === "PMO") {
      refresh();
      const interval = setInterval(() => {
        refresh();
        setTick((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [role, viewMode]);

  if (!(role === "Admin" || role === "PMO")) return null;

  // --- Apply filters ---
  const getFilteredGroups = () => {
    if (viewMode === "all") return grouped;
    const filtered = {};
    Object.keys(grouped).forEach((key) => {
      if (viewMode === "phase" && key === "PreProject") filtered[key] = grouped[key];
      if (viewMode === "category" && key !== "PreProject") filtered[key] = grouped[key];
    });
    return filtered;
  };

  const filteredGroups = getFilteredGroups();

  return (
    <div className="governance-queue">
      <h2>Governance Queue</h2>

      <div className="filter-bar">
        <label>View:&nbsp;</label>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="all">All</option>
          <option value="phase">By Phase</option>
          <option value="category">By Category</option>
        </select>
      </div>

      {Object.keys(filteredGroups).map((key) =>
        filteredGroups[key].length ? (
          <GovernanceGroup
            key={key}
            title={key}
            entries={filteredGroups[key]}
            tick={tick}
          />
        ) : null
      )}
    </div>
  );
}

function GovernanceGroup({ title, entries }) {
  const [open, setOpen] = useState(true);
  const count = entries ? entries.length : 0;

  return (
    <div className="gov-group">
      <div className="gov-group-header" onClick={() => setOpen(!open)}>
        <span>
          {title}
          <span className="gov-badge">{count}</span>
        </span>
        <span>{open ? "▾" : "▸"}</span>
      </div>

      {open && (
        <ul className="gov-list">
          {entries.map((e, idx) => (
            <li key={idx} className="gov-item">
              <div>
                <strong>{e.user}</strong> – {e.action}
              </div>
              <div className="gov-timestamp">{formatLocalTime(e.timestampCreated)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
