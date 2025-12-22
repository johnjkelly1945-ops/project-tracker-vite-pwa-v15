// src/components/PreProject.jsx
import React, { useState, useMemo } from "react";
import TaskPopup from "./TaskPopup";
import "../Styles/PreProject.css";

/*
=====================================================================
METRA — Stage 11.5.x
PreProject Workspace (Visible + Safe-by-Construction)
---------------------------------------------------------------------
• Workspace-authoritative
• No repository coupling
• No demo / seeded data
• Renders safely even when empty
=====================================================================
*/

export default function PreProject() {
  /* ------------------------------------------------------------------
     WORKSPACE STATE (AUTHORITATIVE)
     ------------------------------------------------------------------ */

  // Tasks must ALWAYS be an array
  const [tasks, setTasks] = useState([]);

  const [activeTask, setActiveTask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  /* ------------------------------------------------------------------
     DERIVED STATE (TOTAL — NEVER UNDEFINED)
     ------------------------------------------------------------------ */

  const filteredTasks = useMemo(() => {
    return Array.isArray(tasks) ? tasks : [];
  }, [tasks]);

  /* ------------------------------------------------------------------
     TASK INTERACTION
     ------------------------------------------------------------------ */

  function openPopup(task) {
    if (!task) return;
    setActiveTask(task);
    setShowPopup(true);
  }

  function closePopup() {
    setActiveTask(null);
    setShowPopup(false);
  }

  function updateTask(updatedTask) {
    if (!updatedTask || !updatedTask.id) return;

    setTasks(prev =>
      Array.isArray(prev)
        ? prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
        : []
    );
  }

  /* ------------------------------------------------------------------
     RENDER (VISIBLE EVEN WHEN EMPTY)
     ------------------------------------------------------------------ */

  return (
    <div className="preproject-root">
      {/* Workspace header / scaffold */}
      <div className="preproject-header">
        <h2>PreProject Workspace</h2>
      </div>

      {/* Task list */}
      <div className="preproject-list">
        {filteredTasks.length === 0 && (
          <div className="pp-empty-state">
            No tasks in workspace
          </div>
        )}

        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="pp-task-item"
            onClick={() => openPopup(task)}
          >
            <div className="pp-task-title">
              {task.title || "Untitled task"}
            </div>

            {task.status && (
              <div className={`pp-task-status status-${task.status}`}>
                {task.status}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Task popup */}
      {showPopup && activeTask && (
        <TaskPopup
          task={activeTask}
          onClose={closePopup}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}
