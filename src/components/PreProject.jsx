/* =====================================================================
   METRA – PreProject.jsx
   Phase 4.6 A.1 · Governance Role View Integration (corrected JSX)
   ===================================================================== */

import React, { useState, useEffect } from "react";
import { addAuditEntry, getEntriesByKeyRef } from "../utils/AuditUtils";
import GovernanceQueue from "./GovernanceQueue";
import "../Styles/PreProject.css";

export default function PreProject() {
  // === Current user role (defaults to ProjectManager if none stored) ===
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("metra_user_role") || "ProjectManager"
  );

  // === Working input field and audit log state ===
  const [details, setDetails] = useState("");
  const [auditEntries, setAuditEntries] = useState([]);

  // === Load existing audit trail on mount ===
  useEffect(() => {
    const existing = getEntriesByKeyRef("PreProject");
    setAuditEntries(existing.reverse());
  }, []);

  // === Save handler for PreProject working window ===
  const handleSave = () => {
    if (!details.trim()) return;

    const entry = {
      keyRef: "PreProject",
      user: currentRole,
      action: "PreProject record saved by " + currentRole,
      isEscalated: currentRole === "Admin" || currentRole === "PMO",
    };

    addAuditEntry(entry);

    const updated = getEntriesByKeyRef("PreProject").reverse();
    setAuditEntries(updated);
    setDetails("");
  };

  // === Manual save for testing ===
  const handleManualSave = () => {
    const entry = {
      keyRef: "PreProject",
      user: currentRole,
      action: "Manual save by " + currentRole,
      isEscalated: currentRole === "Admin" || currentRole === "PMO",
    };
    addAuditEntry(entry);
    const updated = getEntriesByKeyRef("PreProject").reverse();
    setAuditEntries(updated);
  };

  // === UI ===
  return (
    <div className="preproject-container">
      <h1>METRA – PreProject</h1>
      <p>
        <strong>Current Role:</strong> {currentRole}
      </p>

      {/* Input area */}
      <textarea
        placeholder="Enter PreProject details here..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      {/* Buttons */}
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={handleSave}>Save</button>{" "}
        <button onClick={handleManualSave}>Manual Save</button>
      </div>

      {/* Audit trail list */}
      <h3 style={{ marginTop: "1.2rem" }}>Audit Trail</h3>
      <div className="audit-trail">
        {auditEntries.length === 0 && (
          <p style={{ color: "#666" }}>No audit entries yet.</p>
        )}
        {auditEntries.map((entry, idx) => (
          <div key={idx} className="audit-entry">
            <div>{entry.action}</div>
            <div className="audit-meta">
              {entry.user} ·{" "}
              {entry.timestampCreated
                ? new Date(entry.timestampCreated).toLocaleString()
                : "Invalid Date"}
            </div>
          </div>
        ))}
      </div>

      {/* Governance Queue for Admin / PMO */}
      <GovernanceQueue role={currentRole} />
    </div>
  );
}
