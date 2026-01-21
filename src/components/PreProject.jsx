// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 182 — Summary Creation (Footer Canonisation)
---------------------------------------------------------------------
INVARIANTS (PRESERVED):
• Footer renders exactly once
• Footer exists only in true single-pane mode
• Footer is outside all scroll containers
• Scroll ownership is explicit and localised
• No footer logic moves upward
• No new authority introduced

CHANGE:
• Forward summary creation props to footer
• No behavioural changes beyond creation affordance visibility
=====================================================================
*/

export default function PreProject({
  tasks = [],
  onOpenTask,
  canCreateTask = false,
  onCreateTask,
  canCreateSummary = false,
  onCreateSummary,
}) {
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
              <p>Operational view.</p>
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
          canCreateSummary={canCreateSummary}
          onCreateSummary={onCreateSummary}
        />
      </div>
    </div>
  );
}
