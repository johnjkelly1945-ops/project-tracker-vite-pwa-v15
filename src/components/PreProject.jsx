// @ts-nocheck
import { useState } from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 104.2 — Summary Activation Controls (REINTRODUCED)
=====================================================================

ROLE
---------------------------------------------------------------------
Workspace summary display with explicit, user-controlled activation.

SEMANTICS (LOCKED)
---------------------------------------------------------------------
• Activation is explicit and reversible
• Activation is visual-only (no mutation authority)
• Only one summary may be active at a time
• Tasks remain first-class and independent
• No ordering changes at this stage
=====================================================================
*/

export default function PreProject({
  summaries = [],
  tasks = [],
  onOpenTask,
  onCreateTaskIntent,
  onAddSummary,
}) {
  /* ================= ACTIVATION STATE ================= */
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  /* ================= ORPHAN TASKS ================= */
  const orphanTasks = tasks.filter((t) => t.summaryId == null);

  function toggleActivation(summaryId) {
    setActiveSummaryId((current) =>
      current === summaryId ? null : summaryId
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      {/* ================= ORPHAN TASKS ================= */}
      {orphanTasks.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h3>Unassigned Tasks</h3>
          {orphanTasks.map((task) => (
            <CanonicalTaskRow
              key={task.id}
              task={task}
              isReadOnly={true}
              onTitleClick={() => onOpenTask(task)}
            />
          ))}
        </div>
      )}

      {/* ================= SUMMARIES ================= */}
      {summaries.map((summary) => {
        const isActive = activeSummaryId === summary.id;
        const isDimmed = activeSummaryId && !isActive;

        return (
          <div
            key={summary.id}
            style={{
              marginBottom: "14px",
              padding: "8px",
              border: "1px dashed #999",
              backgroundColor: isActive ? "#eef6ff" : "#fff",
              opacity: isDimmed ? 0.6 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <strong>
                {summary.title}
                {isActive && " (active)"}
              </strong>

              <button
                type="button"
                onClick={() => toggleActivation(summary.id)}
              >
                {isActive ? "Deactivate" : "Activate"}
              </button>
            </div>

            {tasks
              .filter((t) => t.summaryId === summary.id)
              .map((task) => (
                <CanonicalTaskRow
                  key={task.id}
                  task={task}
                  isReadOnly={true}
                  onTitleClick={() => onOpenTask(task)}
                />
              ))}
          </div>
        );
      })}

      {/* ================= FOOTER ================= */}
      <PreProjectFooter
        summaries={summaries}
        showCreateSummary={true}
        onAddSummary={onAddSummary}
        onCreateTaskIntent={onCreateTaskIntent}
      />
    </div>
  );
}
