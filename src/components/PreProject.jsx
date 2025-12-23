import { useState } from "react";
import AddItemPopup from "./AddItemPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 12.7 — UX Consolidation (Cleanup Step 1)

Notes:
• Workspace is sole execution authority
• Tasks remain inactive
• Summaries are placeholders only
• Temporary test harness removed
=====================================================================
*/

export default function PreProject({
  initialTasks = [],
  initialSummaries = []
}) {
  /* ------------------------------
     Workspace state
  ------------------------------ */
  const [tasks, setTasks] = useState(initialTasks);
  const [summaries] = useState(initialSummaries);

  const [popupMode, setPopupMode] = useState(null);

  /* ------------------------------
     Reassignment execution
  ------------------------------ */
  function handleReassign(intent) {
    const { taskId, fromSummaryId, toSummaryId } = intent;

    if (fromSummaryId === toSummaryId) {
      console.info("[Stage 12.7] Reassign noop", intent);
      setPopupMode(null);
      return;
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, summaryId: toSummaryId ?? null }
          : task
      )
    );

    console.info("[Stage 12.7] Task reassigned", intent);
    setPopupMode(null);
  }

  /* ------------------------------
     Render helpers
  ------------------------------ */
  function renderOrphanTasks() {
    return tasks.filter(task => task.summaryId == null);
  }

  function renderTasksForSummary(summaryId) {
    return tasks.filter(task => task.summaryId === summaryId);
  }

  /* ------------------------------
     Render
  ------------------------------ */
  return (
    <div className="preproject-workspace">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPopupMode("reassign")}>
          Reassign Existing Task
        </button>
      </div>

      <section>
        <h3>Unassigned</h3>
        {renderOrphanTasks().map(task => (
          <div key={task.id}>{task.title}</div>
        ))}
      </section>

      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>
          {renderTasksForSummary(summary.id).map(task => (
            <div key={task.id}>{task.title}</div>
          ))}
        </section>
      ))}

      {popupMode === "reassign" && (
        <AddItemPopup
          mode="reassign"
          tasks={tasks}
          summaries={summaries}
          onReassign={handleReassign}
          onCancel={() => setPopupMode(null)}
        />
      )}
    </div>
  );
}
