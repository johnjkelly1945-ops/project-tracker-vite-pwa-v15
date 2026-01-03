// @ts-nocheck
import { useEffect, useState } from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Primary workspace renderer for tasks and summaries.

STAGE HISTORY
---------------------------------------------------------------------
Stage 28 — Task Creation (RESTORED, SEM-05 compliant)
Stage 38 — Expand / Collapse (Workspace visibility)
Stage 40 — Visual Focus (UI-only, ephemeral)
Stage 51 — Task ↔ Summary association mechanism verified
Stage 53.1 — Task popup invocation surface reintroduced

STAGE 53.1 CONSTRAINTS
---------------------------------------------------------------------
• Task title is a DELIBERATE invocation surface
• Clicking a task title opens the task popup
• Read-only only — no editing, no association
• No lifecycle, focus, or authority changes
• No state mutation beyond invocation

IMPORTANT INVARIANTS
---------------------------------------------------------------------
• Rendering remains task-scoped
• No ambient row click
• No summary-first behaviour
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  onAddSummary,
  onCreateTaskIntent,
  onOpenTask,

  collapsedSummaryIds,
  setCollapsedSummaryIds = () => {},

  focusedSummaryId,
  setFocusedSummaryId,
}) {
  const [summaryOrder, setSummaryOrder] = useState(null);
  const isWorkspaceOwner = true;

  useEffect(() => {
    if (!summaries.length) {
      setSummaryOrder(null);
      return;
    }
    setSummaryOrder(summaries.map((s) => s.id));
  }, [summaries]);

  const orderedSummaries =
    Array.isArray(summaryOrder) && summaryOrder.length
      ? summaryOrder
          .map((id) => summaries.find((s) => s.id === id))
          .filter(Boolean)
      : summaries;

  function toggleCollapse(summaryId) {
    setCollapsedSummaryIds((prev) => {
      const safePrev = prev instanceof Set ? prev : new Set();
      const next = new Set(safePrev);
      if (next.has(summaryId)) next.delete(summaryId);
      else next.add(summaryId);
      return next;
    });
  }

  function toggleFocus(summaryId) {
    setFocusedSummaryId((current) =>
      current === summaryId ? null : summaryId
    );
  }

  const hasFocus = focusedSummaryId !== null;
  const orphanTasks = tasks.filter((t) => t.summaryId === null);

  return (
    <div style={{ padding: "16px" }}>
      {/* ================= UNASSIGNED TASKS ================= */}
      {orphanTasks.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              padding: "8px",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
            }}
          >
            Unassigned Tasks
          </div>

          {orphanTasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: "6px 8px",
                marginLeft: "8px",
                borderLeft: "2px solid #bbb",
              }}
            >
              {/* Stage 53.1 — deliberate task-scoped invocation */}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => onOpenTask(task)}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= SUMMARIES ================= */}
      {orderedSummaries.map((summary) => {
        const isCollapsed =
          collapsedSummaryIds instanceof Set
            ? collapsedSummaryIds.has(summary.id)
            : false;

        const isFocused = focusedSummaryId === summary.id;
        const rowOpacity = hasFocus && !isFocused ? 0.6 : 1;

        return (
          <div
            key={summary.id}
            style={{ marginBottom: "12px", opacity: rowOpacity }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                border: "1px dashed #999",
              }}
            >
              <span>{summary.title}</span>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {isWorkspaceOwner && (
                  <button
                    type="button"
                    onClick={() => toggleFocus(summary.id)}
                    aria-pressed={isFocused}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {isFocused ? "Clear focus" : "Focus"}
                  </button>
                )}

                <button
                  onClick={() => toggleCollapse(summary.id)}
                  aria-label="Toggle task visibility"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {isCollapsed ? "▶" : "▼"}
                </button>
              </div>
            </div>

            {!isCollapsed &&
              tasks
                .filter((t) => t.summaryId === summary.id)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: "6px 8px",
                      marginLeft: "8px",
                      borderLeft: "2px solid #ddd",
                    }}
                  >
                    {/* Stage 53.1 — deliberate task-scoped invocation */}
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => onOpenTask(task)}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
          </div>
        );
      })}

      <PreProjectFooter
        summaries={summaries}
        showCreateSummary={isWorkspaceOwner}
        onAddSummary={onAddSummary}
        onCreateTaskIntent={onCreateTaskIntent}
      />
    </div>
  );
}
