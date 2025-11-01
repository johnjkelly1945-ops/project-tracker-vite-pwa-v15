/* ==========================================================
   METRA – PreProject (Phase 4.5A.0 Layout Sync Ready)
   ----------------------------------------------------------
   • No CSS declarations inside this file
   • Imports PreProject.css for layout styling
   • Fully aligned with Phase 4.4A.2D logic
   ========================================================== */

import React, { useState, useEffect } from "react";
import { useRole } from "../context/RoleContext.jsx";
import GovernanceQueue from "./GovernanceQueue.jsx";
import AuditPanel from "./AuditPanel.jsx";
import "../Styles/PreProject.css";
import { addAuditEntry } from "../utils/AuditUtils.js";

export default function PreProject() {
  const { role } = useRole();
  const [showGovernance, setShowGovernance] = useState(false);
  const [recordText, setRecordText] = useState("");
  const [lastSavedText, setLastSavedText] = useState("");
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [locked, setLocked] = useState(false);

  /* ----------------------------------------------------------
     SAVE HANDLER – silent, triggers only on change
     ---------------------------------------------------------- */
  const handleSave = () => {
    const text = recordText.trim();
    if (!text || text === lastSavedText) return;

    const now = Date.now();
    const visibleAfter = now + 5 * 60 * 1000; // 5-minute window

    setLastSavedText(text);
    setLastSavedTime(now);
    setLocked(false);

    // Queue audit entry silently
    addAuditEntry(`PreProject record saved by ${role}`, "preproject");

    // Persist timer for continuity
    localStorage.setItem(
      "metra_preproject_timer",
      JSON.stringify({ start: now, visibleAfter })
    );
  };

  /* ----------------------------------------------------------
     AUTO-LOCK after 5 minutes with no edits
     ---------------------------------------------------------- */
  useEffect(() => {
    const data = localStorage.getItem("metra_preproject_timer");
    let visibleAfter = null;
    if (data) visibleAfter = JSON.parse(data).visibleAfter;

    const checkLock = () => {
      if (visibleAfter && Date.now() >= visibleAfter) setLocked(true);
    };

    checkLock();
    const interval = setInterval(checkLock, 10000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  /* ----------------------------------------------------------
     EDIT HANDLER – unlocks when typing resumes
     ---------------------------------------------------------- */
  const handleEdit = (e) => {
    setRecordText(e.target.value);
    if (locked) setLocked(false);
  };

  return (
    <div className="preproject-container">
      <h1>METRA – PreProject</h1>
      <p className="role-indicator">
        Current Role: <strong>{role}</strong>
      </p>

      {(role === "Admin" || role === "PMO") && (
        <button
          className="gov-toggle"
          onClick={() => setShowGovernance(!showGovernance)}
        >
          {showGovernance ? "Hide Governance View" : "Show Governance View"}
        </button>
      )}

      {showGovernance && (
        <div className="gov-section">
          <GovernanceQueue />
        </div>
      )}

      {/* Working window under timed discipline */}
      <div
        className={`working-window ${locked ? "locked" : "editable"}`}
        style={{ backgroundColor: locked ? "#f0f0f0" : "#fff" }}
      >
        <textarea
          value={recordText}
          onChange={handleEdit}
          disabled={locked}
          placeholder={
            locked
              ? "Locked after 5 minutes – entry recorded in audit trail."
              : "Enter PreProject details here..."
          }
        />
        <div className="action-buttons">
          <button onClick={handleSave} disabled={locked}>
            Save
          </button>
        </div>
      </div>

      <AuditPanel />
    </div>
  );
}
