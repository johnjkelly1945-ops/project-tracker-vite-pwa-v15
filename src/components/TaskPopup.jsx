// src/components/TaskPopup.jsx
import React, { useState } from "react";

/*
=====================================================================
METRA — Stage 11.2.3
TaskPopup — Status Updates + Append-Only Notes
---------------------------------------------------------------------
• Status selector added
• Immediate workspace update
• Notes remain append-only
• No governance
• No persistence
=====================================================================
*/

const STATUSES = ["Not started", "In progress", "Completed"];

export default function TaskPopup({
  task,
  onClose,
  onAppendNote,
  onStatusChange,
}) {
  if (!task) return null;

  const [draft, setDraft] = useState("");

  const submitNote = () => {
    if (!draft.trim()) return;
    onAppendNote(draft.trim());
    setDraft("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "1rem 1.25rem",
          borderRadius: "8px",
          minWidth: "360px",
          maxWidth: "520px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Task</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <p>
          <strong>Text:</strong> {task.text}
        </p>
        <p>
          <strong>Origin:</strong> {task.origin}
        </p>

        <div style={{ margin: "0.75rem 0" }}>
          <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            Status:
          </label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <hr style={{ margin: "0.75rem 0" }} />

        <h4 style={{ marginBottom: "0.25rem" }}>Notes</h4>

        {task.notes.length === 0 && (
          <p style={{ opacity: 0.6 }}>No notes yet.</p>
        )}

        {task.notes.map((n, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem" }}>{n.text}</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
              {new Date(n.ts).toLocaleString()}
            </div>
          </div>
        ))}

        <textarea
          placeholder="Add note (append-only)…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />

        <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
          <button onClick={submitNote}>Add Note</button>
        </div>

        <p style={{ opacity: 0.6, marginTop: "0.75rem" }}>
          (Status + append-only notes — Stage 11.2.3)
        </p>
      </div>
    </div>
  );
}
