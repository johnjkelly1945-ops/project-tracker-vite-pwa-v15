/* ======================================================================
   METRA – TaskPopup.jsx
   Phase 4.6B.13 Step 8 – Editable Task Status
   ----------------------------------------------------------------------
   Adds:
   - Status dropdown
   - Immediate persistence to task list in PreProject
   - No scheduling logic (pure operational control)
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function TaskPopup({
  task,
  onClose,
  onOpenPerson,
  onOpenGovernance,
  onUpdateStatus,
}) {
  if (!task) return null;

  return (
    <div className="overlay-backdrop z-task">
      <div className="overlay-card">
        <h2>Task Details</h2>

        <div style={{ lineHeight: "1.6", fontSize: "1rem" }}>

          {/* Title */}
          <strong>Title:</strong><br />
          {task.title}<br /><br />

          {/* Editable Status */}
          <strong>Status:</strong><br />
          <select
            className="metra-input"
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <br /><br />

          {/* Assigned Person */}
          <strong>Assigned:</strong><br />
          {task.assigned ? (
            <span
              className="assigned-name"
              style={{ cursor: "pointer" }}
              onClick={() => onOpenPerson(task.assigned)}
            >
              {task.assigned}
            </span>
          ) : (
            "Unassigned"
          )}
          <br /><br />

          {/* Governance Entry */}
          <button
            className="assign-btn"
            onClick={() => onOpenGovernance(task)}
            style={{ marginBottom: "10px" }}
          >
            Governance View
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
