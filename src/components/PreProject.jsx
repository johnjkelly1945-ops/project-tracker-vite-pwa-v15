// @ts-nocheck
import { useState } from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 145.1 — Empty Workspace Baseline Realisation
Stage 146   — Gate G1 Wiring (Footer Active)
=====================================================================
- Read-only task rendering
- Footer rendered explicitly
- Task creation authority expressed only via footer
- No summary creation
=====================================================================
*/

export default function PreProject({
  summaries = [],
  tasks = [],
  onOpenTask,
  onCreateTask,
  canCreateTask,
}) {
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  const orphanTasks = tasks.filter((t) => t.summaryId == null);

  function toggleActivation(summaryId) {
    setActiveSummaryId((current) =>
      current === summaryId ? null : summaryId
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* ================= SCROLLABLE CONTENT ================= */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "12px",
        }}
      >
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
      </div>

      {/* ================= FOOTER (STAGE 146: G1 ACTIVE) ================= */}
      <PreProjectFooter
        canCreateTask={canCreateTask}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
