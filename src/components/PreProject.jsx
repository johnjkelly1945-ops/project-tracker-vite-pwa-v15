import { useState } from "react";
import AddItemPopup from "./AddItemPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 21.3.B — Add Task (workspace, inactive)
---------------------------------------------------------------------
• Workspace-only task creation
• Tasks default to inactive
• No popup on task click
• No activation
• No persistence
=====================================================================
*/

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [popupMode, setPopupMode] = useState(null);

  /* -------------------------------------------------
     Create Summary
     ------------------------------------------------- */
  function handleAddSummary() {
    const title = window.prompt("Summary title");
    if (!title) return;

    setSummaries(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim()
      }
    ]);
  }

  /* -------------------------------------------------
     Create Task (inactive)
     ------------------------------------------------- */
  function handleAddTask(payload) {
    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: payload.title,
        summaryId: payload.summaryId ?? null,
        active: false
      }
    ]);

    setPopupMode(null);
  }

  /* -------------------------------------------------
     Render helpers
     ------------------------------------------------- */
  const orphanTasks = tasks.filter(t => t.summaryId == null);

  const tasksForSummary = id =>
    tasks.filter(t => t.summaryId === id);

  /* -------------------------------------------------
     Render
     ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleAddSummary}>Add Summary</button>
        <button onClick={() => setPopupMode("add-task")}>
          Add Task
        </button>
      </div>

      {/* Orphan tasks */}
      {orphanTasks.length > 0 && (
        <section>
          <h4>Orphan tasks</h4>
          {orphanTasks.map(task => (
            <div key={task.id}>{task.title}</div>
          ))}
        </section>
      )}

      {/* Summaries */}
      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>
          {tasksForSummary(summary.id).map(task => (
            <div key={task.id}>{task.title}</div>
          ))}
        </section>
      ))}

      {/* Add Task popup */}
      {popupMode === "add-task" && (
        <AddItemPopup
          mode="add-task"
          summaries={summaries}
          onConfirm={handleAddTask}
          onCancel={() => setPopupMode(null)}
        />
      )}
    </div>
  );
}
