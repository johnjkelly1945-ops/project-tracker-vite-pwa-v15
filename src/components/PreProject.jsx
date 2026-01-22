// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 189 — Summary Movement (Phase 3: Rendering & Actions)
---------------------------------------------------------------------
CHANGE (STAGE 189 — PHASE 3):
• Render tasks directly under their owning Summary
• Add explicit Summary actions affordance (⋮)
• Preserve focus-only Summary selection
• No footer or pane logic changes

INVARIANTS (PRESERVED):
• Footer renders exactly once
• Footer exists only in true single-pane mode
• Summary selection remains focus-only
• Task ↔ Summary association unchanged (task.summaryId)
• No lifecycle, activation, or navigation semantics introduced
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  selectedSummaryId = null,
  onSelectSummary,
  onOpenTask,
  onOpenSummaryActions,
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
          {summaries.length === 0 && (
            <>
              <p>No summaries in workspace.</p>
              <p>Operational view.</p>
            </>
          )}

          {summaries.map((summary) => {
            const isSelected = summary.id === selectedSummaryId;

            const summaryTasks = tasks.filter(
              (t) => t.summaryId === summary.id
            );

            return (
              <div key={summary.id} style={{ marginBottom: "12px" }}>
                {/* ================= SUMMARY ROW ================= */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "4px",
                    background: isSelected ? "#eef3ff" : "transparent",
                    border: isSelected
                      ? "1px solid #c9d6ff"
                      : "1px solid transparent",
                  }}
                >
                  <div
                    onClick={() =>
                      onSelectSummary && onSelectSummary(summary.id)
                    }
                    style={{
                      cursor: "default",
                      flex: 1,
                    }}
                  >
                    {summary.title || "Untitled summary"}
                  </div>

                  {onOpenSummaryActions && (
                    <button
                      type="button"
                      onClick={() => onOpenSummaryActions(summary.id)}
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                        fontSize: "18px",
                        lineHeight: "1",
                      }}
                      aria-label="Summary actions"
                    >
                      ⋮
                    </button>
                  )}
                </div>

                {/* ================= TASKS UNDER SUMMARY ================= */}
                {summaryTasks.length > 0 && (
                  <div style={{ marginLeft: "16px", marginTop: "6px" }}>
                    {summaryTasks.map((task) => (
                      <CanonicalTaskRow
                        key={task.id}
                        task={task}
                        onOpenTask={onOpenTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
