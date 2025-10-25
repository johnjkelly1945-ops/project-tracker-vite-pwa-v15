/* === METRA – TaskPopupChangeTest.jsx
   Phase 9.7-E Step 1 – Change Request Button + Placeholder Toggle
   --------------------------------------------------------------
   Adds a visual Change Request button inside the popup overlay.
   No data handling — UI toggle only.
*/

import React, { useEffect, useState } from "react";
import "../Styles/TaskPopupChangeTest.css";

const TaskPopupChangeTest = ({ task, onClose }) => {
  const [showChangeRequest, setShowChangeRequest] = useState(false);

  if (!task) return null;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("popup-overlay")) onClose();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Change Control Task</h3>

        <p className="popup-line">
          <strong>Task:</strong> {task.text}
        </p>
        <p className="popup-line">
          <strong>Timestamp:</strong> {task.timestamp}
        </p>

        {/* === New Change Request Button === */}
        <button
          className="popup-change-btn"
          onClick={() => setShowChangeRequest(!showChangeRequest)}
          style={{
            marginTop: "8px",
            padding: "6px 12px",
            backgroundColor: "#0057b8",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          📋 Change Request
        </button>

        {/* === Toggle Placeholder Area === */}
        {showChangeRequest && (
          <div
            className="popup-change-placeholder"
            style={{
              marginTop: "12px",
              backgroundColor: "#f0f0f0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              color: "#333",
              fontStyle: "italic",
            }}
          >
            Change Request area – coming next phase.
          </div>
        )}

        <button className="popup-close" onClick={onClose}>
          × Close
        </button>
      </div>
    </div>
  );
};

export default TaskPopupChangeTest;
