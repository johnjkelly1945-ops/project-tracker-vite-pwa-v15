// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 219 — Summary-Grouped Task Rendering (Visibility Only)
---------------------------------------------------------------------
• Summaries render chronologically
• Tasks associated with summaries render beneath them
• Orphan tasks remain rendered chronologically as before
• Visibility only — no interaction, no authority
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
        {summaries.length > 0 &&
          summaries.map((summary) => (
            <div key={summary.id} style={{ marginBottom: "16px" }}>
              <div
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

              {tasks
                .filter((t) => t.summaryId === summary.id)
                .map((task) => (
                  <CanonicalTaskRow
                    key={task.id}
                    task={task}
                    onOpenTask={onOpenTask}
                  />
                ))}
            </div>
          ))}

        {/* ================= ORPHAN TASKS (UNCHANGED) ================= */}
        {tasks
          .filter((t) => !t.summaryId)
          .map((task) => (
            <CanonicalTaskRow
              key={task.id}
              task={task}
              onOpenTask={onOpenTask}
            />
          ))}
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
