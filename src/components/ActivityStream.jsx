/* ======================================================================
   METRA – ActivityStream.jsx
   Phase 4.6 A.3C – Data Integration
   ----------------------------------------------------------------------
   Displays the most recent Audit Trail actions in a scrollable list.
   ====================================================================== */

import React from "react";

export default function ActivityStream({ auditEntries = [] }) {
  if (!Array.isArray(auditEntries)) return null;

  return (
    <div className="activity-stream">
      {auditEntries.length === 0 ? (
        <div className="activity-line" style={{ color: "#666" }}>
          No recent activity.
        </div>
      ) : (
        auditEntries.map((a, i) => (
          <div key={i} className="activity-line">
            <span className="timestamp">{a.timestampCreated || a.ts}</span> •{" "}
            <span className="user">{a.user}</span> •{" "}
            <span className="action">{a.action}</span> •{" "}
            <span className="type">{a.governanceType || a.type}</span> •{" "}
            <span className="ref">{a.refID || a.ref}</span>
          </div>
        ))
      )}
    </div>
  );
}

/* ======================================================================
   Notes:
   • Accepts a prop array auditEntries.
   • Each entry displays [timestamp] [user] [action] [type] [ref].
   • Gracefully handles empty or missing data.
   • Integrated with GovernanceSummary.jsx and AuditTrailStore.
   ====================================================================== */
