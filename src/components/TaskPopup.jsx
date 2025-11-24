/* ======================================================================
   METRA – TaskPopup.jsx
   v4.6B.14 – Logic Reintegration (Stage 5)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Clean task popup shell
   ✔ Ready for assignment integration (Stage 6)
   ✔ No external dependencies yet except CSS
   ----------------------------------------------------------------------
   CURRENT BEHAVIOUR:
   – Renders when visible={true}
   – Shows title + status
   – Has a close button
   – No personnel, no drill-down yet
   ====================================================================== */

import React from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ visible, task, onClose }) {
  if (!visible || !task) return null;

  return (
    <div className="taskpopup-overlay">
      <div className="taskpopup-window">
        <div className="taskpopup-header">
          <span>Task Details</span>
          <button className="taskpopup-close" onClick={onClose}>×</button>
        </div>

        <div className="taskpopup-body">
          <div className="taskpopup-title">{task.title}</div>
          <div className="taskpopup-status">
            <strong>Status: </strong>
            {task.status}
          </div>
        </div>
      </div>
    </div>
  );
}
