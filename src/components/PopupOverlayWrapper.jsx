/* ======================================================================
   METRA – PopupOverlayWrapper.jsx
   Safe Visual Version – Popup Temporarily Disabled
   ----------------------------------------------------------------------
   • Removes dependency on PopupUniversal.jsx
   • Prevents blank screen error during workspace restoration
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PopupOverlayWrapper({ task, onClose, onSave }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Popup Temporarily Disabled</h3>
        <p>
          The universal popup module (<code>PopupUniversal.jsx</code>) is not
          currently included in this rebuild.
        </p>
        {task && (
          <div className="popup-task-info">
            <strong>Task:</strong> {task.name || "Untitled"}
          </div>
        )}
        <div className="popup-buttons">
          <button onClick={onClose}>Close</button>
          <button
            onClick={() => {
              if (onSave) onSave(task);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
