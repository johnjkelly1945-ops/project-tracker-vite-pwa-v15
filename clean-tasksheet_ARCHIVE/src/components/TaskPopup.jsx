/* ======================================================================
   METRA – TaskPopup.jsx (Clean Tasksheet v5 – Stable Reintegration)
   ----------------------------------------------------------------------
   ✔ Bulletproof notes handling (no crash on old tasks)
   ✔ Safe rendering if task.notes is missing
   ✔ Assignment name displayed correctly
   ✔ Clean styling & scroll-safe structure
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/TaskPopup.css";

export default function TaskPopup({ task, onClose, onSave, onDelete }) {
  if (!task) return null; // defensive guard

  // --- Ensure notes always exists -------------------------------------
  const safeTask = {
    ...task,
    notes: Array.isArray(task.notes) ? task.notes : [],
  };

  const [status, setStatus] = useState(safeTask.status || "Not Started");
  const [notes, setNotes] = useState([...safeTask.notes]);
  const [entry, setEntry] = useState("");

  const assignedName = safeTask.assignedTo || "";

  // --- Add note ---------------------------------------------------------
  const handleAddEntry = () => {
    if (!entry.trim()) return;
    const newNotes = [...notes, { text: entry.trim(), ts: Date.now() }];
    setNotes(newNotes);
    setEntry("");
  };

  // --- Save back to parent ----------------------------------------------
  const handleSave = () => {
    const updated = {
      ...safeTask,
      status,
      notes,
    };
    onSave(updated);
    onClose();
  };

  // --- Delete task -------------------------------------------------------
  const handleDelete = () => {
    onDelete(safeTask.id);
    onClose();
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-window">
        {/* --- Header ----------------------------------------------------- */}
        <div className="popup-header">
          <h2>{safeTask.title}</h2>

          {assignedName && (
            <span className="popup-assigned">
              {assignedName}
            </span>
          )}
        </div>

        {/* --- Status Selector ------------------------------------------- */}
        <div className="popup-status-row">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="popup-status-select"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </div>

        {/* --- Notes Area ------------------------------------------------- */}
        <div className="popup-notes-section">
          <textarea
            placeholder="Type note here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="popup-entry-box"
          />

          <button onClick={handleAddEntry} className="popup-add-btn">
            + Add Entry
          </button>

          <div className="popup-notes-list">
            {notes.length === 0 && (
              <div className="popup-no-notes">No notes yet...</div>
            )}

            {notes.map((n, idx) => (
              <div key={idx} className="popup-note-item">
                <div className="popup-note-text">{n.text}</div>
                <div className="popup-note-ts">
                  {new Date(n.ts).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Footer Buttons -------------------------------------------- */}
        <div className="popup-footer">
          <button onClick={onClose} className="popup-close-btn">
            Close
          </button>

          <button onClick={handleDelete} className="popup-delete-btn">
            Delete
          </button>

          <button onClick={handleSave} className="popup-save-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
