// ======================================================================
// METRA – GovernanceQueuePreview.jsx
// Phase 3.7b – Governance Queue Toolbar Integration
// ----------------------------------------------------------------------
// • Adds Export / Clear toolbar controls
// • Displays total records + last-saved timestamp
// • Compact readable card layout
// • Reads directly from governanceQueueHandler.js
// ======================================================================

import React, { useEffect, useState } from "react";
import {
  listGovernanceRecords,
  getLastSavedTimestamp,
  exportGovernanceQueue,
  clearGovernanceQueue,
} from "../utils/governanceQueueHandler";

export default function GovernanceQueuePreview() {
  const [records, setRecords] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    refreshQueue();
  }, []);

  function refreshQueue() {
    setRecords(listGovernanceRecords());
    setLastSaved(getLastSavedTimestamp());
  }

  const handleExport = () => exportGovernanceQueue();
  const handleClear = () => {
    if (window.confirm("Clear all governance records? This cannot be undone.")) {
      clearGovernanceQueue();
      refreshQueue();
    }
  };

  const containerStyle = {
    background: "#f9fafc",
    border: "1px solid #ccd",
    padding: "1rem",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "1rem auto",
    fontFamily: "Segoe UI, system-ui, sans-serif",
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
  };

  const headerStyle = {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#0a2b5c",
    marginBottom: "0.5rem",
  };

  const toolbarStyle = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.8rem",
  };

  const btnStyle = {
    flex: 1,
    padding: "0.4rem 0.6rem",
    fontSize: "0.9rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const exportBtn = { ...btnStyle, background: "#0078d4", color: "#fff" };
  const clearBtn = { ...btnStyle, background: "#c62828", color: "#fff" };

  const recordStyle = {
    background: "#fff",
    padding: "0.5rem",
    marginBottom: "0.4rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>🧭 Governance Queue Preview</div>

      <div style={toolbarStyle}>
        <button style={exportBtn} onClick={handleExport}>
          🧾 Export JSON
        </button>
        <button style={clearBtn} onClick={handleClear}>
          🗑️ Clear Queue
        </button>
      </div>

      <p>
        <strong>Total Records:</strong> {records.length}
        <br />
        <strong>Last Saved:</strong>{" "}
        {lastSaved ? new Date(lastSaved).toLocaleString() : "Never"}
      </p>

      {records.length === 0 && (
        <p style={{ fontStyle: "italic", color: "#777" }}>
          No governance records stored.
        </p>
      )}

      {records.length > 0 && (
        <div>
          {records.map((r, idx) => (
            <div key={idx} style={recordStyle}>
              <strong>{r.type}</strong> – {r.title}
              <br />
              <span style={{ color: "#555" }}>
                <b>AuditRef:</b> {r.auditRef || "—"} &nbsp;|&nbsp;{" "}
                <b>Link:</b> {r.governanceLink || "—"}
                <br />
                <b>Saved:</b>{" "}
                {r.timestamp
                  ? new Date(r.timestamp).toLocaleString()
                  : "Unknown"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
