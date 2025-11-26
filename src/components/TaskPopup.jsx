/* ======================================================================
   METRA – TaskPopup.jsx
   Version: v6.2 – Clean Working Window (No History)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Opens when a task row is clicked
   ✔ Shows task title + assigned person
   ✔ Allows personnel change
   ✔ Governance button row (non-functional placeholders)
   ✔ Bottom action bar (Mark Complete, Delete, Close)
   ✔ Passes all actions back to PreProject.jsx safely
   ====================================================================== */

import React from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({
  task,
  onClose,
  onAssignPerson,
  onMarkComplete,
  onDelete
}) {
  if (!task) return null;

  return (
    <div className="tp-overlay">
      <div className="tp-window">

        {/* ================================================================
             HEADER
           ================================================================ */}
        <div className="tp-header">
          <h3>{task.title}</h3>
          <button className="tp-close-btn" onClick={onClose}>×</button>
        </div>

        {/* ================================================================
             ASSIGNED PERSON
           ================================================================ */}
        <div className="tp-section">
          <div className="tp-label">Assigned To:</div>

          <div className="tp-person-row">
            <span className="tp-person-name">
              {task.person && task.person !== "" ? task.person : "Unassigned"}
            </span>

            <button
              className="tp-change-btn"
              onClick={onAssignPerson}
            >
              Change
            </button>
          </div>
        </div>

        {/* ================================================================
             GOVERNANCE BUTTON ROW
           ================================================================ */}
        <div className="tp-governance-row">

          {/* Top row: CC / QC / Risk / Issue / Escalate / Email / Docs / Template */}
          <button className="tp-gov-btn">CC</button>
          <button className="tp-gov-btn">QC</button>
          <button className="tp-gov-btn">Risk</button>
          <button className="tp-gov-btn">Issue</button>
          <button className="tp-gov-btn">Escalate</button>
          <button className="tp-gov-btn">Email</button>
          <button className="tp-gov-btn">Docs</button>
          <button className="tp-gov-btn">Template</button>

        </div>

        {/* ================================================================
             BOTTOM ACTION BAR
           ================================================================ */}
        <div className="tp-footer">

          <button
            className="tp-footer-btn"
            onClick={onAssignPerson}
          >
            Change Person
          </button>

          <button
            className="tp-footer-btn"
            onClick={onMarkComplete}
          >
            Mark Completed
          </button>

          <button
            className="tp-footer-btn tp-delete"
            onClick={onDelete}
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}
