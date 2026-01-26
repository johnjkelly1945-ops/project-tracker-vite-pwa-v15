// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 217 — Canonical Creation Surface Restored
---------------------------------------------------------------------
• No inline task creation
• Footer owns Create Task entry
• Visibility-only summaries
• No authority introduced
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
      {/* ================= BODY ================= */}
      <div
        style={{
          flex: 1,
          padding: "14px",
          overflowY: "auto",
        }}
      >
        {/* ================= SUMMARIES (VISIBILITY ONLY) ================= */}
        {summaries.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            {summaries.map((summary) => (
              <div
                key={summary.id}
                style={{
                  padding: "6px 8px",
                  marginBottom: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: "#fafafa",
                }}
              >
                {summary.title || "Untitled summary"}
              </div>
            ))}
          </div>
        )}

        {/* ================= TASKS ================= */}
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

      {/* ================= FOOTER (CANONICAL) ================= */}
      <div
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
