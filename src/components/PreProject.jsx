// @ts-nocheck
import { useEffect, useState } from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

export default function PreProject({
  summaries = [],
  tasks = [],
  onOpenTask,
  onCreateTaskIntent,
  onAddSummary,
}) {
  const [summaryOrder, setSummaryOrder] = useState(null);
  const [collapsedSummaries, setCollapsedSummaries] = useState({});
  const [activeSummaryId, setActiveSummaryId] = useState(null);
  const isWorkspaceOwner = true;

  useEffect(() => {
    if (!Array.isArray(summaryOrder) && summaries.length) {
      setSummaryOrder(summaries.map((s) => s.id));
    }
  }, [summaries, summaryOrder]);

  const orderedSummaries =
    Array.isArray(summaryOrder) && summaryOrder.length
      ? summaryOrder
          .map((id) => summaries.find((s) => s.id === id))
          .filter(Boolean)
      : summaries;

  function toggleCollapse(summaryId) {
    setCollapsedSummaries((prev) => ({
      ...prev,
      [summaryId]: !prev[summaryId],
    }));
  }

  function toggleActivation(summaryId) {
    setActiveSummaryId((current) =>
      current === summaryId ? null : summaryId
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      {orderedSummaries.map((summary) => {
        const isCollapsed = collapsedSummaries[summary.id];
        const isActive = activeSummaryId === summary.id;

        return (
          <div
            key={summary.id}
            style={{
              marginBottom: "14px",
              padding: "8px",
              border: "1px dashed #999",
              backgroundColor: isActive ? "#eef6ff" : "#fff",
              opacity: activeSummaryId && !isActive ? 0.6 : 1,
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

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => toggleCollapse(summary.id)}
                >
                  {isCollapsed ? "▶" : "▼"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleActivation(summary.id)}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>

            {!isCollapsed &&
              tasks
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

      <PreProjectFooter
        summaries={summaries}
        showCreateSummary={isWorkspaceOwner}
        onAddSummary={onAddSummary}
        onCreateTaskIntent={onCreateTaskIntent}
      />
    </div>
  );
}
