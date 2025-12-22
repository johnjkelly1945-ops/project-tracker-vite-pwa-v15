// src/components/TaskPopup.jsx
import React from "react";

/*
=====================================================================
METRA — Stage 11.2.1
TaskPopup (OPEN / CLOSE ONLY)
---------------------------------------------------------------------
• No external CSS dependency
• Minimal inline styling
• Read-only placeholder content
• No editing
• No persistence
=====================================================================
*/

export default function TaskPopup({ task, onClose }) {
  if (!task) return null;

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
          background: "#fff",
          padding: "1rem 1.25rem",
          borderRadius: "8px",
          minWidth: "300px",
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

        <div>
          <p><strong>Text:</strong> {task.text}</p>
          <p><strong>Origin:</strong> {task.origin}</p>

          <p style={{ opacity: 0.6, marginTop: "1rem" }}>
            (Read-only — Stage 11.2.1)
          </p>
        </div>
      </div>
    </div>
  );
}
