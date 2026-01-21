// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 175.0 — Workspace Task Rendering (Render-Only)
---------------------------------------------------------------------
INVARIANTS (PRESERVED):
• Footer renders exactly once
• Footer exists only in true single-pane mode
• Footer is outside all scroll containers
• Scroll ownership is explicit and localised
• No footer logic moves upward
• No new authority introduced

STAGE INTENT:
• Restore visual rendering of tasks in the workspace
• Render-only (no mutation, no interaction change)
=====================================================================
*/

export default function PreProject({
  focus,
  tasks = [],
  onOpenTask,
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
      {/* ================= PANE HEADER (NON-SCROLLING) ================= */}
      <div
        className="single-pane-header"
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

      {/* ================= BODY REGION (NON-SCROLL) ================= */}
      <div
        className="single-pane-body-region"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ================= SCROLL REGION (SOLE SCROLLER) ================= */}
        <div
          className="single-pane-scroll-region"
          style={{
            flex: 1,
            padding: "14px",
            overflowY: "auto",
          }}
        >
          {tasks.length === 0 ? (
            <>
              <p>No tasks in workspace.</p>
              <p>{paneTitle} operational view.</p>
            </>
          ) : (
            tasks.map((task) => (
              <CanonicalTaskRow
                key={task.id}
                task={task}
                onOpenTask={onOpenTask}
              />
            ))
          )}
        </div>
      </div>

      {/* ================= FOOTER REGION (LOCKED) ================= */}
      <div
        className="single-pane-footer-region"
        style={{
          borderTop: "1px solid #ddd",
          background: "#f5f5f5",
        }}
      >
        <PreProjectFooter
          canCreateTask={canCreateTask}
          onCreateTask={onCreateTask}
        />
      </div>
    </div>
  );
}
