/* ======================================================================
   METRA – ActivityStream.jsx
   Phase 4.6 A.3B – Styling & Polish
   ====================================================================== */
import React from "react";

export default function ActivityStream({ auditEntries }) {
  return (
    <div className="activity-stream">
      {auditEntries.map((a, i) => (
        <div key={i} className="activity-line">
          <span className="timestamp">{a.ts}</span> •
          <span className="user">{a.user}</span> •
          <span className="action">{a.action}</span> •
          <span className="type">{a.type}</span> •
          <span className="ref">{a.ref}</span>
        </div>
      ))}
    </div>
  );
}
