/* ======================================================================
   METRA – TaskWorkingWindow.jsx
   Clean Stable Popup – Assigned Person Clickable
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

  const addNote = () => {
    if (!noteInput.trim()) return;
    const entry = `[${timestamp()}] ${noteInput}`;
    onSaveNotes(task.id, entry);
    setNoteInput("");
  };

  return (
    <div className="ww-backdrop">
      <div className="ww-card">

        {/* Header */}
        <h2 className="ww-title">{task.title}</h2>

        {/* Assigned person clickable INSIDE popup */}
        {task.assigned && (
          <div
            className="ww-assigned ww-assigned-clickable"
            onClick={onOpenPersonnelDetail}
          >
            — {task.assigned}
          </div>
        )}

        {/* Notes display */}
        <div className="ww-notes-display">
          {task.notes?.length > 0 ? (
            task.notes.map((n, i) => (
              <div key={i} className="ww-note-line">{n}</div>
            ))
          ) : (
            <div className="ww-note-empty">No notes yet.</div>
          )}
        </div>

        {/* Text input */}
        <textarea
          className="ww-input"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNote())}
        />

        {/* Button row */}
        <div className="ww-actions-row">
          <button onClick={onInvokeCC}>CC</button>
          <button onClick={onInvokeQC}>QC</button>
          <button onClick={onInvokeEscalate}>Escalate</button>
          <button>Email</button>
          <button>Docs</button>
          <button>Template</button>

          <button className="delete" onClick={() => onArchiveTask(task.id)}>
            Delete
          </button>
        </div>

        <button className="ww-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
