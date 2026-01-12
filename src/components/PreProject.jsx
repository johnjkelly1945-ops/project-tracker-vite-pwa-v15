// @ts-nocheck
import { useState } from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 104.3.C — Layout Authority Correction
Stage 106.2C  — Summary Removal Wiring (Footer Pass-Through)
=====================================================================
- Root establishes a height contract
- Content scrolls; footer remains visible
- No semantic or authority changes
=====================================================================
*/

export default function PreProject({
  summaries = [],
  tasks = [],
  onOpenTask,
  onCreateTaskIntent,
  onAddSummary,
  moveActiveSummary,
  onRemoveSummary,
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

      {/* ================= FOOTER (NON-SCROLLING) ================= */}
      <PreProjectFooter
        summaries={summaries}
        activeSummaryId={activeSummaryId}
        moveActiveSummary={moveActiveSummary}
        showCreateSummary={true}
        onAddSummary={onAddSummary}
        onCreateTaskIntent={onCreateTaskIntent}
        onRemoveSummary={onRemoveSummary}
      />
    </div>
  );
}
