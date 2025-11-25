/* ============================================================================
   METRA – PreProjectFooter.jsx
   SAFE RESILIENT VERSION — prevents undefined callback crash
   ----------------------------------------------------------------------------
   Works even if DualPane or PreProject does NOT pass handlers yet.
   ============================================================================= */

import React from "react";
import "../Styles/PreProjectFooter.css";

export default function PreProjectFooter({
  onAddSummary,
  onAddTask,
  onViewRepo
}) {
  // Safe fallbacks so React NEVER crashes
  const safeAddSummary = onAddSummary || (() => {});
  const safeAddTask = onAddTask || (() => {});
  const safeViewRepo = onViewRepo || (() => {});

  return (
    <div className="pp-footer-bar">
      <button className="pp-footer-btn" onClick={safeAddSummary}>
        Add Summary
      </button>

      <button className="pp-footer-btn" onClick={safeAddTask}>
        Add Task
      </button>

      <button className="pp-footer-btn" onClick={safeViewRepo}>
        View Repository
      </button>
    </div>
  );
}
