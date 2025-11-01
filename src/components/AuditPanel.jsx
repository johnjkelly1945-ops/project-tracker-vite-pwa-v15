/* ==========================================================
   METRA – AuditPanel (Phase 4.4A.1)
   ----------------------------------------------------------
   Implements the 5-minute deferred-visibility model.
   • Entries stay hidden for 5 min after save.
   • Edits/resaves within 5 min reset the timer.
   • After 5 min of inactivity, the record releases
     into the visible audit trail.
   • Text remains freely selectable/copyable.
   ========================================================== */

import React, { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext.jsx";
import "../Styles/PreProject.css";

/* ----------------------------------------------------------
   Load existing data or initialise empty array
   ---------------------------------------------------------- */
const loadAudit = () => {
  try {
    return JSON.parse(localStorage.getItem("metra_audit_log")) || [];
  } catch {
    return [];
  }
};

export default function AuditPanel() {
  const { role } = useRole();
  const [auditLog, setAuditLog] = useState(loadAudit());

  /* ----------------------------------------------------------
     Save helper
     ---------------------------------------------------------- */
  const saveAudit = (data) => {
    localStorage.setItem("metra_audit_log", JSON.stringify(data));
    setAuditLog(data);
  };

  /* ----------------------------------------------------------
     Add or update a pending entry
     ---------------------------------------------------------- */
  const addAuditEntry = (actionText, keyRef = "generic") => {
    const now = Date.now();
    const visibleAfter = now + 5 * 60 * 1000; // 5 minutes
    let stored = loadAudit();

    // Remove any pending (unreleased) entry for same keyRef + user
    stored = stored.filter(
      (e) => !(e.keyRef === keyRef && !e.released && e.user === role)
    );

    const newEntry = {
      id: stored.length + 1,
      keyRef,
      user: role,
      action: actionText,
      timestampCreated: now,
      visibleAfter,
      released: false,
    };

    const updated = [newEntry, ...stored];
    saveAudit(updated);
  };

  /* ----------------------------------------------------------
     Background release check – runs every minute
     ---------------------------------------------------------- */
  useEffect(() => {
    const checkRelease = () => {
      const stored = loadAudit();
      const now = Date.now();
      const updated = stored.map((e) =>
        now >= e.visibleAfter ? { ...e, released: true } : e
      );
      saveAudit(updated);
    };

    checkRelease(); // initial run
    const interval = setInterval(checkRelease, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /* ----------------------------------------------------------
     Visible released entries only
     ---------------------------------------------------------- */
  const visibleEntries = auditLog.filter((e) => e.released);

  return (
    <div className="audit-panel-container">
      <h2 className="audit-header">Audit Trail – Confirmed Activity</h2>

      <div className="audit-actions">
        <button
          className="audit-add-btn"
          onClick={() =>
            addAuditEntry(`Manual save by ${role}`, "manual-test")
          }
        >
          Add Test Entry
        </button>
      </div>

      <div className="audit-list">
        {visibleEntries.length === 0 ? (
          <p className="audit-empty">No confirmed entries yet.</p>
        ) : (
          visibleEntries.map((entry) => (
            <div key={entry.id} className="audit-item">
              <div className="audit-time">
                {new Date(entry.timestampCreated).toLocaleString()}
              </div>
              <div className="audit-user">{entry.user}</div>
              <div className="audit-action">{entry.action}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
