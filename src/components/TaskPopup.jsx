/* ======================================================================
   METRA – TaskPopup.jsx
   v7 A2 – Rebuilt from last verified stable logic (v4.6B.13)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Full governance popup window
   ✔ CC / QC / Risk / Issue / Escalate / Email / Docs / Template actions
   ✔ Footer row: Change Person / Mark Completed / Delete
   ✔ Clean overlay layout – independent of DualPane
   ✔ Uses "task", "onClose", "onUpdate" props
   ====================================================================== */

import React from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onUpdate }) {
  if (!task) return null;

  const applyStatus = (newStatus) => {
    onUpdate({ status: newStatus });
  };

  const applyFlag = (flagColor) => {
    onUpdate({ flag: flagColor });
  };

  const deleteTask = () => {
    onUpdate({ delete: true });
  };

  return (
    <div className="taskpopup-overlay">

      <div className="taskpopup-window">

        {/* -------------------------------------------
            HEADER
        -------------------------------------------- */}
        <div className="tp-header">
          <h3>{task.title}</h3>
          <button className="tp-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* -------------------------------------------
            MAIN CONTENT
        -------------------------------------------- */}
        <div className="tp-body">

          {/* STATUS SECTION */}
          <div className="tp-section">
            <h4>Status</h4>
            <div className="tp-status-buttons">
              <button onClick={() => applyStatus("Not Started")}>Not Started</button>
              <button onClick={() => applyStatus("In Progress")}>In Progress</button>
              <button onClick={() => applyStatus("Completed")}>Completed</button>
            </div>
          </div>

          {/* FLAGS */}
          <div className="tp-section">
            <h4>Task Flags</h4>
            <div className="tp-flag-buttons">
              <button onClick={() => applyFlag("amber")}>Amber</button>
              <button onClick={() => applyFlag("red")}>Red</button>
              <button onClick={() => applyFlag("")}>Clear</button>
            </div>
          </div>

          {/* GOVERNANCE ACTIONS */}
          <div className="tp-section">
            <h4>Governance</h4>
            <div className="tp-gov-buttons">
              <button>CC</button>
              <button>QC</button>
              <button>Risk</button>
              <button>Issue</button>
              <button>Escalate</button>
              <button>Email</button>
              <button>Docs</button>
              <button>Template</button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------
            FOOTER ACTIONS
        -------------------------------------------- */}
        <div className="tp-footer">

          <button className="tp-footer-btn">Change Person</button>

          <button
            className="tp-footer-btn"
            onClick={() => applyStatus("Completed")}
          >
            Mark Completed
          </button>

          <button
            className="tp-footer-btn tp-delete"
            onClick={deleteTask}
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}
