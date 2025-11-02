/* ==========================================================
   METRA – AuditPanel (Phase 4.5A.1 Refresh-on-Render Edition)
   ----------------------------------------------------------
   • Reads audit data live from localStorage
   • Emits 'auditEntryReleased' event on new entry
   ========================================================== */

import React, { useState, useEffect } from "react";

export default function AuditPanel() {
  const [auditEntries, setAuditEntries] = useState([]);
  const [lastCount, setLastCount] = useState(0);

  const loadEntries = () => {
    const stored = JSON.parse(localStorage.getItem("metra_audit_log") || "[]");
    setAuditEntries(stored);
    return stored;
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = loadEntries();
      if (stored.length > lastCount) {
        const newEntry = stored[stored.length - 1];
        window.dispatchEvent(
          new CustomEvent("auditEntryReleased", { detail: newEntry })
        );
        setLastCount(stored.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [lastCount]);

  return (
    <div className="audit-panel-container">
      <div className="audit-header">Audit Trail</div>
      <div className="audit-list">
        {auditEntries.length === 0 && (
          <div className="audit-item">No audit entries yet.</div>
        )}
        {auditEntries.map((entry) => (
          <div key={entry.id} className="audit-item">
            <div className="audit-action">{entry.action}</div>
            <div className="audit-meta">
              <span className="audit-user">{entry.user}</span> ·{" "}
              <span className="audit-time">
                {new Date(entry.timestampCreated).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
