// @ts-nocheck
import React from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 166 — Restore G1 Footer Mount (Single-Pane Only)
---------------------------------------------------------------------
• Rendered only in true single-pane mode
• ↙ return arrow restores dual-pane
• Mounts G1 task-creation footer (gated)
• No layout or authority changes
=====================================================================
*/

export default function PreProject({
  focus,
  onReturnToDual,
  canCreateTask = false,
  onCreateTask,
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

      {/* ================= FOOTER (G1 — SINGLE-PANE ONLY) ================= */}
      <PreProjectFooter
        canCreateTask={canCreateTask}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
