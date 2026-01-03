/**
 * =====================================================================
 * METRA — TaskPopup.jsx
 * =====================================================================
 *
 * ROLE
 * ---------------------------------------------------------------------
 * Task-scoped popup shell.
 *
 * STAGE 53.1 CONSTRAINTS
 * ---------------------------------------------------------------------
 * - READ-ONLY
 * - Invocation surface only
 * - No editing
 * - No summary selection
 * - No authority logic
 *
 * FUTURE STAGES
 * ---------------------------------------------------------------------
 * - Stage 53.2+: summary selection
 * - Stage 53.3+: authority enforcement
 * - Later: notes, reminders, governance actions
 * =====================================================================
 */

import React from "react";

export default function TaskPopup({ task, onClose }) {
  return (
    <div className="task-popup-overlay">
      <div className="task-popup">
        <h3>Task</h3>

        <p>
          <strong>Title:</strong> {task.title}
        </p>

        <p style={{ fontStyle: "italic", opacity: 0.7 }}>
          Additional task actions will appear here in later stages.
        </p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
