/* ======================================================================
   METRA – MetricCard.jsx
   Phase 4.6 A.3B – Styling & Polish
   ====================================================================== */
import React from "react";

export default function MetricCard({ type, count, lastEntryTime, className }) {
  return (
    <div className={`metric-card ${className || ""}`}>
      <h4>{type}</h4>
      <p className="metric-count">{count}</p>
      <small>Last entry {lastEntryTime}</small>
    </div>
  );
}
