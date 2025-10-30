/* ======================================================================
   METRA – AuditConsolePreview.jsx
   Phase 3.4 – Read-Only Audit Console (Preview Mode)
   ----------------------------------------------------------------------
   • Displays cached audit events linked by auditRef
   • Read-only, non-interactive viewer
   • Invoked from popup or future Summary Task panel
   ====================================================================== */

import React, { useEffect, useState } from "react";
import { getAuditCache } from "../utils/auditHandler";
import "../Styles/PreProject.css";

export default function AuditConsolePreview({ auditRef, onClose }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (auditRef) {
      const cached = getAuditCache(auditRef);
      setEntries(cached || []);
    }
  }, [auditRef]);

  if (!auditRef) return null;

  return (
    <div className="overlay-backdrop overlay-fade">
      <div className="overlay-container audit-console">
        <h2 className="popup-title">
          Audit Console – {auditRef}
        </h2>

        {entries.length === 0 ? (
          <p className="audit-empty">No audit entries recorded for this reference.</p>
        ) : (
          <ul className="audit-list">
            {entries.map((e, i) => (
              <li key={i} className="audit-item">
                <strong>{e.actionType}</strong> | {e.entityType}:{e.entityId} 
                <span className="audit-time">{new Date(e.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="popup-buttons">
          <button className="popup-btn-close" onClick={onClose}>✖ Close</button>
        </div>
      </div>
    </div>
  );
}
