/* ======================================================================
   METRA — TaskPopup.jsx
   Single Continuous Notes Log
   Stage 11.3 — Final Clarified Behaviour
   ----------------------------------------------------------------------
   RULES:
   • One notes area only
   • Notes area IS the log
   • Users append at the end
   • Save locks all content
   • No separate “new note” field
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/TaskPopup.css";
import {
  saveTaskNotes,
  loadTaskNotes
} from "../utils/workspace/workspaceStore";

export default function TaskPopup({
  task,
  onClose,
  onDelete
}) {
  if (!task) return null;

  /* --------------------------------------------------------------
     Load existing notes and compose log text
     -------------------------------------------------------------- */
  const existingNotes = loadTaskNotes(task.id);

  const initialText = existingNotes
    .map(
      (n) =>
        `${n.text}\n${new Date(n.ts).toLocaleString()}`
    )
    .join("\n\n");

  const [noteText, setNoteText] = useState(initialText);

  /* --------------------------------------------------------------
     Save = commit boundary (append-only)
     -------------------------------------------------------------- */
  function handleSave() {
    const blocks = noteText
      .split(/\n\n+/)
      .map((b) => b.trim())
      .filter(Boolean);

    const parsedNotes = [];

    for (let i = 0; i < blocks.length; i += 2) {
      const text = blocks[i];
      const ts = blocks[i + 1]
        ? new Date(blocks[i + 1]).getTime()
        : Date.now();

      parsedNotes.push({ text, ts });
    }

    saveTaskNotes(task.id, parsedNotes);
    onClose();
  }

  function handleDelete() {
    if (onDelete) onDelete(task);
  }

  /* --------------------------------------------------------------
     Render — single continuous notes log
     -------------------------------------------------------------- */
  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <div className="popup-header">
          <h3>{task.title || "Task"}</h3>
        </div>

        <textarea
          className="popup-entry-box"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Notes…"
          style={{ minHeight: "240px" }}
        />

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
