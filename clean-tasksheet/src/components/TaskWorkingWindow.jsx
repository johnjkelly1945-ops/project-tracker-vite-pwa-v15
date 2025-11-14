/* ======================================================================
   METRA – TaskWorkingWindow.jsx
   Final Full Version (Rolling Edit Window, Inline Editing, Two-Row Toolbar)
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";

export default function TaskWorkingWindow({
  task,
  onClose,
  onSaveNotes,
  onArchiveTask,
  onInvokeCC,
  onInvokeQC,
}) {

  /* ============================================================
     1. LOCAL STATE
     ============================================================ */
  const [noteInput, setNoteInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  const scrollRef = useRef(null);

  const timestamp = () => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ============================================================
     2. SCROLL TO BOTTOM ON NEW NOTES
     ============================================================ */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [task.notes]);

  /* ============================================================
     3. ADD NEW NOTE (PM/Admin/User color applied later)
     ============================================================ */
  const addNote = () => {
    if (!noteInput.trim()) return;

    const entry = {
      text: noteInput.trim(),
      timestamp: timestamp(),
      createdAt: Date.now(),
      role: "pm",   // ★ Replace this with real role logic later
    };

    onSaveNotes(task.id, entry);
    setNoteInput("");
  };

  /* ============================================================
     4. INLINE EDITING (click to edit)
     ============================================================ */
  const beginEdit = (index) => {
    const note = task.notes[index];
    const age = Date.now() - note.createdAt;

    if (age > 5 * 60 * 1000) return; // ★ LOCKED — cannot edit

    setEditingIndex(index);
    setEditingText(note.text);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;

    const updated = [...task.notes];
    updated[editingIndex] = {
      ...updated[editingIndex],
      text: editingText,
      createdAt: Date.now(), // ★ resets 5-min window
    };

    onSaveNotes(task.id, updated, true);
    setEditingIndex(null);
    setEditingText("");
  };

  /* ============================================================
     5. BUTTON HELPERS (add note + timestamp)
     ============================================================ */
  const buttonEntry = (msg) => {
    const entry = {
      text: msg,
      timestamp: timestamp(),
      createdAt: Date.now(),
      role: "pm",
    };
    onSaveNotes(task.id, entry);
  };

  /* ============================================================
     6. ACTION BUTTONS
     ============================================================ */
  const handleCC = () => buttonEntry("CC raised for review");
  const handleQC = () => buttonEntry("Quality check requested");
  const handleRisk = () => buttonEntry("Risk entry added");
  const handleIssue = () => buttonEntry("Issue recorded");

  const handleEscInternal = () => {
    buttonEntry("Escalated to Project Board");
    onInvokeCC(task.id, "Internal");  // sets orange flag
  };

  const handleEscPMO = () => {
    buttonEntry("Escalated to PMO");
    onInvokeQC(task.id, "External QC"); // sets red flag
  };

  const handleTemplate = () => buttonEntry("Template accessed");
  const handleDocs = () => buttonEntry("Document linked");
  const handleEmail = () => buttonEntry("Email action taken");

  const handleDelete = () => {
    buttonEntry("Task deleted by PM");
    onArchiveTask(task.id);
  };

  /* ============================================================
     7. RENDER
     ============================================================ */
  return (
    <div className="ww-backdrop">
      <div className="ww-card" style={{ width: "520px" }}>

        {/* ================= HEADER ================= */}
        <div className="ww-header">
          <h2 className="ww-title">{task.title}</h2>
          {task.assigned && (
            <div className="ww-assigned">— {task.assigned}</div>
          )}
        </div>

        {/* ================= NOTES DISPLAY ================= */}
        <div className="ww-notes-display" ref={scrollRef}>
          {!task.notes || task.notes.length === 0 ? (
            <div className="ww-note-empty">No notes yet.</div>
          ) : (
            task.notes.map((note, idx) => {
              const age = Date.now() - note.createdAt;
              const locked = age > 5 * 60 * 1000;

              return (
                <div
                  key={idx}
                  className={`ww-note-line note-${note.role}`}
                  onClick={() => !locked && beginEdit(idx)}
                >
                  {editingIndex === idx ? (
                    <input
                      className="ww-edit-input"
                      value={editingText}
                      autoFocus
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), commitEdit())
                      }
                    />
                  ) : (
                    <>
                      {note.text} — {note.timestamp}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ================= INPUT BOX ================= */}
        <textarea
          className="ww-input"
          value={noteInput}
          placeholder="Add a note…"
          onChange={(e) => setNoteInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNote())}
        />

        {/* ================= ACTION BAR (ROW 1) ================= */}
        <div className="ww-actions-row">
          <button onClick={handleCC}>CC</button>
          <button onClick={handleQC}>QC</button>
          <button onClick={handleRisk}>Risk</button>
          <button onClick={handleIssue}>Issue</button>
          <button onClick={handleEscInternal}>Esc Internal</button>
          <button onClick={handleEscPMO}>Esc PMO</button>
        </div>

        {/* ================= ACTION BAR (ROW 2) ================= */}
        <div className="ww-actions-row">
          <button onClick={handleTemplate}>Template</button>
          <button onClick={handleDocs}>Docs</button>
          <button onClick={handleEmail}>Email</button>
          <button className="delete" onClick={handleDelete}>Delete</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
