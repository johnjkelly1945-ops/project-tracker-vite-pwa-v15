// @ts-nocheck
/*
=====================================================================
METRA — PreProject.jsx
Stage 195 — Single Stream Workspace Rendering (CANONICAL)
---------------------------------------------------------------------
• One continuous workspace stream
• Tasks render chronologically at top level by default
• Summaries are the ONLY grouping structure
• Tasks move position when associated with a summary
• No orphan lists, regions, or headers
=====================================================================
*/

import React from "react";

export default function PreProject({
  summaries,
  tasks,
  selectedSummaryId,
  onSelectSummary,
  onOpenTask,
  onOpenSummaryActions,
  canCreateTask,
  onCreateTask,
  canCreateSummary,
  onCreateSummary,
  showFooter = true,
}) {
  /* ================================================================
     DERIVED
     ================================================================ */

  // Top-level tasks = tasks not associated with any summary
  const topLevelTasks = tasks.filter((t) => t.summaryId === null);

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* SINGLE CONTINUOUS STREAM */}

        {/* Top-level tasks (chronological) */}
        {topLevelTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onOpenTask && onOpenTask(task)}
            style={{
              padding: "8px 10px",
              marginBottom: 6,
              border: "1px solid #ddd",
              borderRadius: 4,
              cursor: onOpenTask ? "pointer" : "default",
              background: "#fff",
            }}
          >
            {task.title}
          </div>
        ))}

        {/* Summaries as structural anchors */}
        {summaries.map((summary) => (
          <div key={summary.id} style={{ marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: 8,
                cursor: onSelectSummary ? "pointer" : "default",
              }}
              onClick={() =>
                onSelectSummary && onSelectSummary(summary.id)
              }
            >
              <span>{summary.title}</span>

              {onOpenSummaryActions && (
                <button onClick={() => onOpenSummaryActions(summary.id)}>
                  ⋮
                </button>
              )}
            </div>

            {/* Tasks that belong to this summary */}
            {tasks
              .filter((t) => t.summaryId === summary.id)
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenTask && onOpenTask(task)}
                  style={{
                    padding: "8px 10px",
                    marginBottom: 6,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    cursor: onOpenTask ? "pointer" : "default",
                    background: "#f9f9f9",
                  }}
                >
                  {task.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* FOOTER (SINGLE PANE ONLY) */}
      {showFooter && (
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            padding: 12,
            display: "flex",
            gap: 8,
          }}
        >
          {canCreateTask && (
            <button onClick={onCreateTask}>Create Task</button>
          )}
          {canCreateSummary && (
            <button onClick={onCreateSummary}>Create Summary</button>
          )}
        </div>
      )}
    </div>
  );
}
