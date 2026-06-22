// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
=====================================================================

Stage 220 — Summary Modal Trigger (Visibility-Preserving)

Stage 320A — Diagnostic Removal (Stabilisation)
---------------------------------------------------------------------
• Removes Stage 301 console logging
• No behavioural change
• No authority change
• Pure render component
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  onOpenTask,
  onOpenSummary,
  canCreateTask = false,
  onCreateTask,
  canCreateSummary = false,
  onCreateSummary,
  canOpenRepository = false,
  onOpenRepository,
  canOpenParticipation = false,
  onOpenParticipation,
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
        {/* ================= SUMMARIES ================= */}
        {summaries.length > 0 &&
          summaries.map((summary) => (
            <div key={summary.id} style={{ marginBottom: "16px" }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenSummary?.(summary.id)}
                style={{
                  padding: "6px 8px",
                  marginBottom: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: "#fafafa",
                  cursor: "pointer",
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

        {/* ================= ORPHAN TASKS ================= */}
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

      {/* ================= FOOTER ================= */}
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
          canOpenRepository={canOpenRepository}
          onOpenRepository={onOpenRepository}
            canOpenParticipation={canOpenParticipation}
            onOpenParticipation={onOpenParticipation}
        />
      </div>
    </div>
  );
}
