// @ts-nocheck
import React, { useState } from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 191 — Task Collapse / Reveal (Visual-Only)
---------------------------------------------------------------------
CHANGE (STAGE 191):
• Add per-Summary collapse / reveal toggle (visual-only)
• Toggle located on right side of Summary row
• Default state: expanded
• No persistence, no task mutation

INVARIANTS (PRESERVED):
• Summary selection remains focus-only
• Task ↔ Summary association unchanged (task.summaryId)
• Orphaned tasks unaffected
• Footer renders exactly once
• No lifecycle, archive, or authority semantics introduced
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
  /* ===================== UI-ONLY COLLAPSE STATE ===================== */
  const [collapsedBySummaryId, setCollapsedBySummaryId] = useState({});

  function toggleCollapsed(summaryId) {
    setCollapsedBySummaryId((c) => ({
      ...c,
      [summaryId]: !c[summaryId],
    }));
  }

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
            const isCollapsed = !!collapsedBySummaryId[summary.id];

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
                  {/* Title (focus-only selection) */}
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

                  {/* Collapse / Reveal toggle (Stage 191) */}
                  <button
                    type="button"
                    onClick={() => toggleCollapsed(summary.id)}
                    aria-expanded={!isCollapsed}
                    title={isCollapsed ? "Expand tasks" : "Collapse tasks"}
                    style={{
                      marginLeft: "8px",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      fontSize: "14px",
                      lineHeight: "1",
                    }}
                  >
                    {isCollapsed ? "▸" : "▾"}
                  </button>

                  {/* Summary actions (⋮) */}
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
                {!isCollapsed && summaryTasks.length > 0 && (
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
