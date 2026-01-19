// @ts-nocheck
import React from "react";

/*
=====================================================================
METRA — PreProject.jsx
Stage 158 — Section C
Single-Pane Operational Workspace
---------------------------------------------------------------------
• Rendered only in single-pane mode
• One pane only (focused)
• ↙ return arrow restores dual-pane
• Footer exists only here
• No execution semantics added yet
=====================================================================
*/

export default function PreProject({
  focus,
  onReturnToDual,
}) {
  const paneTitle =
    focus === "management"
      ? "Management"
      : focus === "development"
      ? "Development"
      : "Workspace";

  return (
    <div
      className="single-pane-root"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderTop: "1px solid #ccc",
      }}
    >
      {/* ================= PANE HEADER ================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderBottom: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <strong>{paneTitle}</strong>

        <button
          type="button"
          title="Return to dual pane"
          onClick={onReturnToDual}
          style={{
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ↙
        </button>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div
        style={{
          flex: 1,
          padding: "14px",
          overflowY: "auto",
        }}
      >
        <p>No tasks in workspace.</p>
        <p>{paneTitle} operational view.</p>
      </div>

      {/* ================= FOOTER (OPERATIONAL ONLY) ================= */}
      <div
        style={{
          borderTop: "1px solid #ddd",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "flex-end",
          background: "#f5f5f5",
        }}
      >
        <button
          type="button"
          disabled
          style={{
            opacity: 0.6,
            cursor: "not-allowed",
          }}
        >
          Execute
        </button>
      </div>
    </div>
  );
}
