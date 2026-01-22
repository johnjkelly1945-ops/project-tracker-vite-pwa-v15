// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 185 — Summary Selection (Inspection → Focus Only)
---------------------------------------------------------------------
CHANGE (STAGE 185):
• Visual focus for a single summary placeholder
• Local, reversible selection
• No activation, navigation, lifecycle, or authority

INVARIANTS (PRESERVED):
• Footer renders exactly once
• Footer exists only in true single-pane mode
• No footer logic moves upward
• No task semantics changed
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  selectedSummaryId = null,
  onSelectSummary,
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
          {/* ================= SUMMARY PLACEHOLDERS (FOCUS ONLY) ================= */}
          {summaries.length > 0 &&
            summaries.map((summary) => {
              const isSelected = summary.id === selectedSummaryId;

              return (
                <div
                  key={summary.id}
                  onClick={() => onSelectSummary && onSelectSummary(summary.id)}
                  style={{
                    padding: "6px 8px",
                    marginBottom: "6px",
                    borderRadius: "4px",
                    background: isSelected ? "#eef3ff" : "transparent",
                    border: isSelected ? "1px solid #c9d6ff" : "1px solid transparent",
                    cursor: "default",
                  }}
                >
                  {summary.title || "Untitled summary"}
                </div>
              );
            })}

          {/* ================= TASK REGION ================= */}
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
