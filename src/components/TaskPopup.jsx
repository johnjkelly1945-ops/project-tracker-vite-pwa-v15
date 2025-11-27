/* ======================================================================
   METRA – TaskPopup.jsx
   v6.2 – Reintegration for DualPane Mode
   ----------------------------------------------------------------------
   Stable minimal popup:
   ✔ Opens when a task is clicked
   ✔ Shows title + person + status
   ✔ Provides Return to Workspace button
   ✔ Footer placeholder for governance buttons (disabled for now)
   ====================================================================== */

import React from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="tp-overlay">
      <div className="tp-window">

        {/* ===== Header ===== */}
        <div className="tp-header">
          <div className="tp-title">{task.title}</div>
          <button className="tp-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ===== Body ===== */}
        <div className="tp-body">

          <div className="tp-section">
            <div className="tp-label">Assigned To:</div>
            <div className="tp-value">{task.person || "Unassigned"}</div>
          </div>

          <div className="tp-section">
            <div className="tp-label">Status:</div>
            <div className="tp-value">{task.status}</div>
          </div>

        </div>

        {/* ===== Footer ===== */}
        <div className="tp-footer">
          <button className="tp-btn-return" onClick={onClose}>
            Return to Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
