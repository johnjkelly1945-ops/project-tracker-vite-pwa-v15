/* ======================================================================
   METRA – PreProject.jsx
   Branch: feature-preproject-popup-integration-phase1
   ----------------------------------------------------------------------
   - Restores verified PreProject layout (blue header + white cards)
   - Integrates Universal Popup (PopupUniversal.jsx)
   - Each task opens its own popup log (persistent per task)
   - Fixes dark-mode artefacts with enforced white inputs
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PopupUniversal from "./PopupUniversal.jsx";
import "../Styles/PreProject.css";

export default function PreProject() {
  const STORAGE_KEY = "metra_preproject_tasks_v1";

  // === Load or initialise tasks ===
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: "Define project objectives",
        status: "In Progress",
        logKey: "task_1_log",
      },
      {
        id: 2,
        title: "Identify key stakeholders",
        status: "Not Started",
        logKey: "task_2_log",
      },
    ];
  });

  const [activeTask, setActiveTask] = useState(null);

  // === Persist tasks ===
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // === Cycle task status ===
  const cycleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next =
          t.status === "Not Started"
            ? "In Progress"
            : t.status === "In Progress"
            ? "Completed"
            : "Not Started";
        return { ...t, status: next };
      })
    );
  };

  // === Add new task ===
  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: "New Pre-Project Task",
      status: "Not Started",
      logKey: `task_${Date.now()}_log`,
    };
    setTasks([...tasks, newTask]);
  };

  // === Clear all tasks ===
  const clearAll = () => {
    if (window.confirm("Clear all pre-project tasks?")) {
      setTasks([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // === Popup handlers ===
  const openPopup = (task) => setActiveTask(task);
  const closePopup = () => setActiveTask(null);

  // === Apply inline white-input style (prevents Safari dark artefacts) ===
  const whiteInputFix = `
    textarea, input[type="text"], input[type="url"], input[type="email"] {
      background-color: #fff !important;
      color: #000 !important;
    }
  `;

  return (
    <div className="preproject-container">
      <style>{whiteInputFix}</style>

      <h1 className="preproject-title">Pre-Project Task List</h1>

      <div className="preproject-controls">
        <button onClick={addTask} className="btn-blue">
          Add
        </button>
        <button onClick={clearAll} className="btn-grey">
          Clear All
        </button>
      </div>

      <div className="preproject-tasklist">
        {tasks.map((task) => (
          <div key={task.id} className="preproject-taskcard">
            <div className="task-row">
              <span
                className={`task-title ${
                  task.status === "Completed"
                    ? "task-complete"
                    : task.status === "In Progress"
                    ? "task-progress"
                    : "task-pending"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => cycleStatus(task.id)}
                className="btn-status"
              >
                {task.status === "Not Started"
                  ? "Start"
                  : task.status === "In Progress"
                  ? "Complete"
                  : "Reset"}
              </button>
            </div>

            <div className="task-actions">
              <button
                onClick={() => openPopup(task)}
                className="btn-entry"
              >
                🗒 Open Log
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeTask && (
        <PopupUniversal
          taskId={activeTask.id}
          taskTitle={activeTask.title}
          storageKey={`METRA_preproject_${activeTask.logKey}`}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
