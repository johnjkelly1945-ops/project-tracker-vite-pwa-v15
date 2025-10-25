/* === METRA – TaskPopupChangeTest.jsx (Diagnostic Visibility Test)
   Phase 9.5 – Popup Overlay Reintegration
   ---------------------------------------------------------------
   Diagnostic version to confirm the popup is rendering in DOM.
   Temporary red background used for visibility.
*/

import React, { useEffect } from "react";
import "../Styles/TaskPopupChangeTest.css";

const TaskPopupChangeTest = ({ task, onClose }) => {
  // Guard: if no task, render nothing
  if (!task) return null;

  console.log("🎯 Popup component rendering:", task.text);

  // Close popup when clicking outside the box
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
        <button className="popup-close" onClick={onClose}>
          × Close
        </button>
      </div>
    </div>
  );
};

export default TaskPopupChangeTest;
