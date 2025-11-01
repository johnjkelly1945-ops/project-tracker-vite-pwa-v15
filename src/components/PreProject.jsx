/* ==========================================================
   METRA – PreProject (Phase 4.4A.2C – Silent Timer Discipline)
   ----------------------------------------------------------
   • Unified 5-minute working-window & audit discipline
   • Silent operation (no alerts, popups, or countdowns)
   • Save triggers timer only if content changed
   • Locks automatically after 5 minutes of inactivity
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
    if (!text) return; // ignore blank entries

    // skip if no changes since last save
    if (text === lastSavedText) return;

    const now = Date.now();
    const visibleAfter = now + 5 * 60 * 1000; // 5 minutes

    setLastSavedText(text);
    setLastSavedTime(now);
    setLocked(false);

    // queue audit entry silently
    addAuditEntry(`PreProject record saved by ${role}`, "preproject");

    // persist timer information for session continuity
    localStorage.setItem(
      "metra_preproject_timer",
      JSON.stringify({ start: now, visibleAfter })
    );
  };

  /* ----------------------------------------------------------
     AUTO-LOCK after 5 minutes of inactivity
     ---------------------------------------------------------- */
  useEffect(() => {
    const timerData = localStorage.getItem("metra_preproject_timer");
    let visibleAfter = null;

    if (timerData) {
      const parsed = JSON.parse(timerData);
      visibleAfter = parsed.visibleAfter;
    }

    const checkLock = () => {
      if (visibleAfter && Date.now() >= visibleAfter) setLocked(true);
    };

    checkLock(); // run once on mount
    const interval = setInterval(checkLock, 10000); // every 10 s
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  /* ----------------------------------------------------------
     EDIT HANDLER – resets lock when editing resumes
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

      {/* Governance toggle for authorised roles */}
      {(role === "Admin" || role === "PMO" || role === "ProjectManager") && (
        <button
          className="gov-toggle"
          onClick={() => setShowGovernance(!showGovernance)}
        >
          {showGovernance ? "Hide Governance View" : "Show Governance View"}
        </button>
      )}

      {/* Governance Queue */}
      {showGovernance && (
        <div className="gov-section">
          <GovernanceQueue />
        </div>
      )}

      {/* ------------------------------------------------------
          WORKING WINDOW (5-minute discipline)
          ------------------------------------------------------ */}
      <div
        className={`working-window ${locked ? "locked" : "editable"}`}
        style={{ backgroundColor: locked ? "#f0f0f0" : "#ffffff" }}
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

      {/* Audit Trail (read-only, selectable) */}
      <AuditPanel />
    </div>
  );
}
