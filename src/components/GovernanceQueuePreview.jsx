/* ======================================================================
   METRA – GovernanceQueuePreview.jsx
   Stable Simplified Version
   ----------------------------------------------------------------------
   • Displays Governance Queue (audit-linked)
   • Export / Clear controls retained
   ====================================================================== */

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
    if (window.confirm("Clear all governance records?")) {
      clearGovernanceQueue();
      refreshQueue();
    }
  };

  return (
    <div style={{
      background: "#f9fafc",
      border: "1px solid #ccd",
      padding: "1rem",
      borderRadius: "10px",
      maxWidth: "600px",
      margin: "1rem auto",
      fontFamily: "Segoe UI, system-ui, sans-serif",
      boxShadow: "0 0 6px rgba(0,0,0,0.1)",
    }}>
      <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0a2b5c" }}>
        🧭 Governance Queue Preview
      </div>

      <div style={{ display: "flex", gap: "0.5rem", margin: "0.8rem 0" }}>
        <button style={{ flex: 1, background: "#0078d4", color: "#fff", border: "none",
          borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", fontWeight: 600 }}
          onClick={handleExport}>🧾 Export JSON</button>

        <button style={{ flex: 1, background: "#c62828", color: "#fff", border: "none",
          borderRadius: "6px", padding: "0.4rem 0.6rem", cursor: "pointer", fontWeight: 600 }}
          onClick={handleClear}>🗑️ Clear Queue</button>
      </div>

      <p>
        <strong>Total Records:</strong> {records.length}<br/>
        <strong>Last Saved:</strong> {lastSaved ? new Date(lastSaved).toLocaleString() : "Never"}
      </p>

      {records.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#777" }}>No governance records stored.</p>
      ) : (
        records.map((r, i) => (
          <div key={i} style={{
            background: "#fff",
            padding: "0.5rem",
            marginBottom: "0.4rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "0.9rem",
          }}>
            <strong>{r.type}</strong> – {r.title}<br/>
            <span style={{ color: "#555" }}>
              <b>AuditRef:</b> {r.auditRef || "—"} | <b>Link:</b> {r.governanceLink || "—"}<br/>
              <b>Saved:</b> {r.timestamp ? new Date(r.timestamp).toLocaleString() : "Unknown"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
