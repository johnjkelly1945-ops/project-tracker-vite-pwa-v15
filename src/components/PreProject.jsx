import { useState } from "react";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 24 — Behaviour Activation (Corrected)
---------------------------------------------------------------------
• PreProject remains renderer / intent-raiser
• Workspace remains authoritative
• Activates: click task → open TaskPopup
• No persistence
• No semantic changes
• No governance / role / timing logic
=====================================================================
*/

export default function PreProject(props) {
  const { tasks = [], summaries = [], onAddSummary } = props;

  const [selectedTask, setSelectedTask] = useState(null);

  /* -------------------------------------------------
     Summary creation (PM-by-convention)
     ------------------------------------------------- */
  function handleAddSummary() {
    const title = window.prompt("Summary title");
    if (!title || !title.trim()) return;
    onAddSummary(title);
  }

  /* -------------------------------------------------
     Task selection
     ------------------------------------------------- */
  function handleTaskClick(task) {
    setSelectedTask(task);
  }

  function handleClosePopup() {
    setSelectedTask(null);
  }

  /* -------------------------------------------------
     Render helpers
     ------------------------------------------------- */
  const tasksForSummary = (id) =>
    tasks.filter(task => task.summaryId === id);

  const orphanTasks = tasks.filter(task => task.summaryId == null);

  /* -------------------------------------------------
     Render
     ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      {/* Add Summary */}
      <button onClick={handleAddSummary}>
        Add Summary
      </button>

      {/* Orphan tasks */}
      {orphanTasks.map(task => (
        <div
          key={task.id}
          style={{ cursor: "pointer" }}
          onClick={() => handleTaskClick(task)}
        >
          {task.title}
        </div>
      ))}

      {/* Summaries */}
      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>

          {tasksForSummary(summary.id).map(task => (
            <div
              key={task.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleTaskClick(task)}
            >
              {task.title}
            </div>
          ))}
        </section>
      ))}

      {/* Task Popup */}
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
