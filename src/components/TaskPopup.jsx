// src/components/TaskPopup.jsx
import React, { useState } from "react";

/*
=====================================================================
METRA — Stage 11.3.2
TaskPopup — Governance Entry Points (INTENT ONLY)
---------------------------------------------------------------------
• Governance actions emit intent only
• No execution, no persistence
• Notes + status remain functional
=====================================================================
*/

const STATUSES = ["Not started", "In progress", "Completed"];
const GOVERNANCE_ACTIONS = [
  { key: "CC", label: "Change Control" },
  { key: "Risk", label: "Risk" },
  { key: "Issue", label: "Issue" },
  { key: "Quality", label: "Quality" },
  { key: "Escalate", label: "Escalate" },
];

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

  const emitGovernanceIntent = (action) => {
    const intent = {
      type: "governance-intent",
      action,
      taskId: task.id,
      origin: task.origin,
      timestamp: new Date().toISOString(),
    };

    console.log("🧭 GOVERNANCE INTENT", intent);
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
          minWidth: "380px",
          maxWidth: "560px",
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

        <p><strong>Text:</strong> {task.text}</p>
        <p><strong>Origin:</strong> {task.origin}</p>

        <div style={{ margin: "0.75rem 0" }}>
          <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
            Status:
          </label>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <hr />

        <h4>Governance (intent only)</h4>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {GOVERNANCE_ACTIONS.map((g) => (
            <button
              key={g.key}
              onClick={() => emitGovernanceIntent(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <hr style={{ margin: "0.75rem 0" }} />

        <h4>Notes</h4>

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
          (Governance intent only — Stage 11.3.2)
        </p>
      </div>
    </div>
  );
}
