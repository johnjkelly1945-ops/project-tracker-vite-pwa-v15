/*
=====================================================================
METRA — TaskPopup.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Inspection-first task popup with controlled, append-only note entry.

STAGE
---------------------------------------------------------------------
Stage 55 — Controlled Action Reintroduction (55.3)

CONSTRAINTS
---------------------------------------------------------------------
• Read-only inspection by default
• Only authorised mutation: append-only note
• Explicit confirm / cancel
• No association, lifecycle, or workflow mutation
=====================================================================
*/

import { useState } from "react";

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
}) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  if (!task) return null;

  const summary =
    task.summaryId !== null
      ? summaries.find((s) => s.id === task.summaryId)
      : null;

  function handleConfirmNote() {
    if (!noteDraft.trim()) return;
    onAddNote(task.id, noteDraft.trim());
    setNoteDraft("");
    setIsAddingNote(false);
  }

  function handleCancelNote() {
    setNoteDraft("");
    setIsAddingNote(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "520px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "6px",
          padding: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ margin: 0 }}>{task.title}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        {/* ================= METADATA ================= */}
        <div
          style={{
            fontSize: "12px",
            color: "#555",
            marginBottom: "12px",
          }}
        >
          <div>Task ID: {task.id}</div>
        </div>

        {/* ================= ASSOCIATION CONTEXT ================= */}
        <div
          style={{
            marginBottom: "12px",
            padding: "8px",
            background: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "13px",
          }}
        >
          <strong>Summary:</strong>{" "}
          {summary ? summary.title : "Unassigned"}
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div style={{ marginBottom: "12px" }}>
          <strong>Description</strong>
          <div style={{ marginTop: "4px", color: "#444" }}>
            {task.description || "No description provided."}
          </div>
        </div>

        {/* ================= NOTES ================= */}
        <div style={{ marginBottom: "12px" }}>
          <strong>Notes</strong>

          <div style={{ marginTop: "6px", fontSize: "13px", color: "#444" }}>
            {Array.isArray(task.notes) && task.notes.length > 0 ? (
              task.notes.map((note, idx) => (
                <div key={idx} style={{ marginBottom: "6px" }}>
                  {note}
                </div>
              ))
            ) : (
              <div style={{ fontStyle: "italic", color: "#777" }}>
                No notes yet.
              </div>
            )}
          </div>
        </div>

        {/* ================= ADD NOTE (INLINE) ================= */}
        {isAddingNote && (
          <div style={{ marginBottom: "12px" }}>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={3}
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="Enter note…"
            />
            <div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
              <button onClick={handleConfirmNote}>Save note</button>
              <button onClick={handleCancelNote}>Cancel</button>
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {!isAddingNote && (
            <button onClick={() => setIsAddingNote(true)}>Add note</button>
          )}
        </div>
      </div>
    </div>
  );
}
