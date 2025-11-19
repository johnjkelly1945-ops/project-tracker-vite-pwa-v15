/* ======================================================================
   METRA – TaskPopup.jsx
   Baseline: v5 Stable (pre-governance wiring)
   ----------------------------------------------------------------------
   ✔ Large popup layout
   ✔ Title + Assigned person (clickable)
   ✔ Notes area
   ✔ Status dropdown
   ✔ 9 governance buttons (not wired yet)
   ✔ Close button
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onOpenPerson }) {

  const [notes, setNotes] = useState(task.notes || "");
  const [status, setStatus] = useState(task.status);

  return (
    <div className="popup-backdrop">
      <div className="popup-window">

        {/* HEADER */}
        <div className="popup-header">
          <h2>{task.title}</h2>

          {/* Assigned person */}
          {task.person && (
            <div
              className="assigned-person"
              onClick={() => onOpenPerson(task.person)}
            >
              {task.person}
            </div>
          )}
        </div>

        {/* STATUS */}
        <div className="popup-section">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>

        {/* NOTES */}
        <div className="popup-section">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add task notes here..."
          />
        </div>

        {/* GOVERNANCE BUTTONS */}
        <div className="popup-governance-row">
          <button>Notes</button>
          <button>Risks</button>
          <button>Issues</button>
          <button>Quality</button>
          <button>Decisions</button>
          <button>Meetings</button>
          <button>Attachments</button>
          <button>Audit Trail</button>
          <button>Comments</button>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="popup-footer">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
