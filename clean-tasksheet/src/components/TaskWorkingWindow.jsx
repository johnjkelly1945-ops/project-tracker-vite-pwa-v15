/* ======================================================================
   METRA – TaskWorkingWindow.jsx
   Step 7 – Clean Popup + Guaranteed Hand Cursor + Clickable Name
   ====================================================================== */

import React, { useState } from "react";

export default function TaskWorkingWindow({
  task,
  onClose,
  onSaveNotes,
  onArchiveTask,
  onInvokeCC,
  onInvokeQC,
  onInvokeEscalate,
  onOpenPersonnelDetail
}) {

  const [noteInput, setNoteInput] = useState("");

  /* Timestamp for notes */
  const timestamp = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  /* Add a note */
  const addNote = () => {
    if (!noteInput.trim()) return;
    const entry = `[${timestamp()}] ${noteInput}`;
    onSaveNotes(task.id, entry);
    setNoteInput("");
  };

  return (
    <div className="ww-backdrop">
      <div className="ww-card">

        {/* ==============================================================
           Header – Title + Assigned Person (Clickable with hand cursor)
        ============================================================== */}
        <h2 className="ww-title">{task.title}</h2>

        {task.assigned && (
          <div
            className="ww-assigned ww-assigned-clickable"
            style={{
              cursor: "pointer",
              textDecoration: "underline"
            }}
            onClick={onOpenPersonnelDetail}
          >
            — {task.assigned}
          </div>
        )}

        {/* ==============================================================
           Notes Display
        ============================================================== */}
        <div className="ww-notes-display">
          {task.notes?.length > 0 ? (
            task.notes.map((n, i) => (
              <div key={i} className="ww-note-line">
                {n}
              </div>
            ))
          ) : (
            <div className="ww-note-empty">No notes yet.</div>
          )}
        </div>

        {/* ==============================================================
           Notes Input (Enter to add)
        ============================================================== */}
        <textarea
          className="ww-input"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNote();
            }
          }}
        />

        {/* ==============================================================
           Action Buttons
        ============================================================== */}
        <div className="ww-actions-row">
          <button onClick={onInvokeCC}>CC</button>
          <button onClick={onInvokeQC}>QC</button>
          <button onClick={onInvokeEscalate}>Escalate</button>
          <button>Email</button>
          <button>Docs</button>
          <button>Template</button>

          <button
            className="delete"
            onClick={() => onArchiveTask(task.id)}
          >
            Delete
          </button>
        </div>

        {/* ==============================================================
           Close Button
        ============================================================== */}
        <button className="ww-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
