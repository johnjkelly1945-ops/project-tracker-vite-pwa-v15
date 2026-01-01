// @ts-nocheck
import { useEffect, useState } from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 38 — Expand / Collapse (Workspace Visibility)

HARDENING:
• Render-safe handling of collapsedSummaryIds
• Prevents undefined.has() during React/HMR replay
• Fully fail-closed
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  onAddSummary,

  // Stage 38 workspace UI-state (defensive defaults)
  collapsedSummaryIds,
  setCollapsedSummaryIds = () => {},
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

  return (
    <div style={{ padding: "16px" }}>
      {orderedSummaries.map((summary) => {
        const isCollapsed =
          collapsedSummaryIds instanceof Set
            ? collapsedSummaryIds.has(summary.id)
            : false;

        return (
          <div key={summary.id} style={{ marginBottom: "12px" }}>
            {/* Summary row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                border: "1px dashed #999",
                opacity: 0.6,
              }}
            >
              <span>{summary.title}</span>

              {/* Expand / collapse arrow */}
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
