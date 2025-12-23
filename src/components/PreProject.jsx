import { useState } from "react";
import AddItemPopup from "./AddItemPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 12.7-B — Add Task UX (Workspace-only)

• Workspace is sole execution authority
• Tasks are created inactive
• Assignment optional at creation
• Summaries are placeholders only
• Footer is temporary action host
=====================================================================
*/

export default function PreProject({
  initialTasks = [],
  initialSummaries = []
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [summaries] = useState(initialSummaries);
  const [popupMode, setPopupMode] = useState(null);

  /* ------------------------------
     Task creation
  ------------------------------ */
  function handleAddTask(payload) {
    const { title, summaryId = null } = payload;

    const newTask = {
      id: crypto.randomUUID(),
      title,
      summaryId,
      status: "inactive"
    };

    setTasks(prev => [...prev, newTask]);

    console.info("[Stage 12.7-B] Task created", newTask);
    setPopupMode(null);
  }

  /* ------------------------------
     Reassignment (existing, locked)
  ------------------------------ */
  function handleReassign(intent) {
    const { taskId, fromSummaryId, toSummaryId } = intent;

    if (fromSummaryId === toSummaryId) {
      console.info("[Stage 12.7-B] Reassign noop", intent);
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

    console.info("[Stage 12.7-B] Task reassigned", intent);
    setPopupMode(null);
  }

  /* ------------------------------
     Render helpers
  ------------------------------ */
  const orphanTasks = tasks.filter(t => t.summaryId == null);
  const tasksForSummary = id => tasks.filter(t => t.summaryId === id);

  /* ------------------------------
     Render
  ------------------------------ */
  return (
    <div className="preproject-workspace">
      {/* Footer-level actions (temporary host) */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPopupMode("add-task")}>
          Add Task
        </button>
        <button onClick={() => setPopupMode("reassign")}>
          Reassign Task
        </button>
      </div>

      <section>
        <h3>Unassigned</h3>
        {orphanTasks.map(task => (
          <div key={task.id}>{task.title}</div>
        ))}
      </section>

      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>
          {tasksForSummary(summary.id).map(task => (
            <div key={task.id}>{task.title}</div>
          ))}
        </section>
      ))}

      {popupMode === "add-task" && (
        <AddItemPopup
          mode="add-task"
          summaries={summaries}
          onConfirm={handleAddTask}
          onCancel={() => setPopupMode(null)}
        />
      )}

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
