/* ======================================================================
   METRA – MetricCard.jsx
   ====================================================================== */
import React from "react";

export default function MetricCard({ type, count, lastEntryTime }) {
  return (
    <div className="metric-card">
      <h4>{type}</h4>
      <p className="metric-count">{count}</p>
      <small>Last entry {lastEntryTime}</small>
    </div>
  );
}

