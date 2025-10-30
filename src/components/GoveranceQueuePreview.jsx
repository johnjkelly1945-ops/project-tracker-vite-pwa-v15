/* ======================================================================
   METRA – GovernanceQueuePreview.jsx
   Phase 3.6 – Silent Console / Optional Viewer
   ----------------------------------------------------------------------
   • Displays all governance records for validation
   • Non-interactive (for development verification)
   ====================================================================== */

import React, { useEffect, useState } from "react";
import { listGovernanceRecords } from "../utils/governanceQueueHandler";

export default function GovernanceQueuePreview() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecords([...listGovernanceRecords()]);
    }, 3000); // auto-refresh every 3 s
    return () => clearInterval(interval);
  }, []);

  if (!records.length)
    return <div style={{ padding: "0.5rem", color: "#888" }}>No governance records yet…</div>;

  return (
    <div style={{ padding: "1rem", fontFamily: "system-ui", fontSize: "0.9rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Governance Queue (dev preview)</h3>
      {records.map((r) => (
        <div
          key={r.id}
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <strong>{r.type}</strong> – {r.title}
          <div style={{ fontSize: "0.8rem", color: "#555" }}>
            Ref: {r.auditRef} | Link: {r.governanceLink}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#777" }}>{r.timestamp}</div>
        </div>
      ))}
    </div>
  );
}
