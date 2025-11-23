/* ======================================================================
   METRA – TaskPopup.jsx
   Step 3 – Simple Centre Modal
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Basic popup when clicking a task
   ✔ No logic, no assignment, no status handling
   ✔ Very safe version to reintroduce popup behaviour
   ====================================================================== */

import React from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-window">
        <h2 className="popup-title">{task}</h2>
        <button className="popup-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
