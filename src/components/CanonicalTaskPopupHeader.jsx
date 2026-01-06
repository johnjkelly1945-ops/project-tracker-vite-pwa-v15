import React from "react";

/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 81 — Step 2 (Task Popup Header Implementation)
---------------------------------------------------------------------
Design-only → Controlled implementation

IMPORTANT:
• This component is NOT wired into the UI.
• It introduces NO new semantics.
• It causes NO browser regression.
• Rendering only — no workflow, no authority change.
=====================================================================
*/

/**
 * Props contract (locked):
 *
 * task: {
 *   id: string
 *   title: string
 *   isFlagged: boolean     // reminder (clock)
 * }
 *
 * isReadOnly: boolean
 * onToggleFlag?: () => void
 * onClose?: () => void
 */

export default function CanonicalTaskPopupHeader({
  task,
  isReadOnly,
  onToggleFlag,
  onClose,
}) {
  if (!task) return null;

  // -----------------------------
  // Styling (neutral, non-opinionated)
  // -----------------------------
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
    userSelect: "none",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    flexGrow: 1,
  };

  const controlsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconButtonStyle = {
    fontSize: "16px",
    background: "none",
    border: "none",
    cursor: isReadOnly ? "default" : "pointer",
    color: "#374151",
    opacity: isReadOnly ? 0.5 : 1,
    padding: 0,
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div style={headerStyle}>
      {/* Task title */}
      <div style={titleStyle}>{task.title}</div>

      {/* Header controls */}
      <div style={controlsStyle}>
        {/* Reminder (Flag → Clock) */}
        <button
          type="button"
          aria-label="Toggle reminder"
          title="Reminder"
          style={iconButtonStyle}
          disabled={isReadOnly}
          onClick={() => {
            if (!isReadOnly && onToggleFlag) {
              onToggleFlag();
            }
          }}
        >
          {task.isFlagged ? "🕒" : "🕒"}
        </button>

        {/* Close control (UI chrome only) */}
        <button
          type="button"
          aria-label="Close"
          title="Close"
          style={iconButtonStyle}
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
