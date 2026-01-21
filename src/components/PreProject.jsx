// @ts-nocheck
import React from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 171 — Footer Authority Hardening (Minimal, Structural)
---------------------------------------------------------------------
INVARIANTS (LOCKED):
• Footer MUST render exactly once
• Footer MUST exist only in true single-pane mode
• Footer MUST be outside ALL scroll containers
• Scroll ownership MUST be explicit and localised
• No footer logic may move upward into App or DualPane

This structure enforces:
A1 — Footer-only mutation authority
L1 — Footer visibility (non-scrolling)
L2 — Scroll isolation
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
          <p>No tasks in workspace.</p>
          <p>{paneTitle} operational view.</p>
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
