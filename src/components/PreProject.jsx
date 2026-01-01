// @ts-nocheck
import { useEffect, useState } from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 38 — Expand / Collapse (Workspace Visibility)
Stage 40 — Phase 4 — Visual Focus (Pattern A: de-emphasis of others)

REFINEMENT:
• Focus visual softened (opacity 0.6 instead of 0.35)
• No semantic or behavioural change
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  onAddSummary,

  // Stage 38 workspace UI-state (defensive defaults)
  collapsedSummaryIds,
  setCollapsedSummaryIds = () => {},

  // Stage 40 focus state (App-owned)
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

  return (
    <div style={{ padding: "16px" }}>
      {orderedSummaries.map((summary) => {
        const isCollapsed =
          collapsedSummaryIds instanceof Set
            ? collapsedSummaryIds.has(summary.id)
            : false;

        const isFocused = focusedSummaryId === summary.id;

        // Pattern A — de-emphasis of others (softened)
        const rowOpacity =
          hasFocus && !isFocused ? 0.6 : 1;

        return (
          <div
            key={summary.id}
            style={{ marginBottom: "12px", opacity: rowOpacity }}
          >
            {/* Summary row */}
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
                {/* Stage 40 — Focus toggle (owner-only, UI-only) */}
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

                {/* Expand / collapse arrow (unchanged) */}
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

            {/* Tasks aligned to this summary */}
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
                    {task.title}
                  </div>
                ))}
          </div>
        );
      })}

      <PreProjectFooter
        summaries={summaries}
        showCreateSummary={isWorkspaceOwner}
        onAddSummary={onAddSummary}
        onCreateTaskIntent={() => {}}
      />
    </div>
  );
}
