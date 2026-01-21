// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 183 — Summary Visibility (Inspection Only)
---------------------------------------------------------------------
INVARIANTS (PRESERVED):
• Footer renders exactly once
• Footer exists only in true single-pane mode
• Footer is outside all scroll containers
• Scroll ownership is explicit and localised
• No footer logic moves upward
• No new authority introduced
• No interaction introduced

CHANGE (STAGE 183):
• Render existing summaries as read-only text
• Visibility only — no selection, no activation
• Summaries are informational artifacts only
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
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
          {/* ================= SUMMARY VISIBILITY (INSPECTION ONLY) ================= */}
          {summaries.length > 0 && (
            <div
              className="summary-visibility-region"
              style={{
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                Summaries
              </div>

              {summaries.map((summary) => (
                <div
                  key={summary.id}
                  style={{
                    padding: "4px 0",
                  }}
                >
                  {summary.title || "Untitled summary"}
                </div>
              ))}
            </div>
          )}

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
