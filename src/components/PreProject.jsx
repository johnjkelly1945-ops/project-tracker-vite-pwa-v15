/* ======================================================================
   METRA – PreProject.jsx
   Phase 3 – Step 2 Popup Embed Integration (v3.0b)
   ----------------------------------------------------------------------
   • Restores verified PreProject task list layout
   • Adds overlay popup containing PopupUniversal component
   • Maintains dark background + blur when active
   • Save / Close persist as expected
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PopupOverlayWrapper from "./PopupOverlayWrapper.jsx";
import "../Styles/PreProject.css";

export default function PreProject() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("metra_preproject_tasks");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "Define project objectives", status: "In Progress" },
          { id: 2, title: "Identify key stakeholders", status: "Not Started" },
          { id: 3, title: "Prepare feasibility summary", status: "Not Started" },
        ];
  });

  const [activeTask, setActiveTask] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("metra_preproject_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleOpenOverlay = (task) => {
    setActiveTask(task);
    setOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
    setActiveTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    handleCloseOverlay();
  };

  const cycleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const next =
          task.status === "Not Started"
            ? "In Progress"
            : task.status === "In Progress"
            ? "Completed"
            : "Not Started";
        return { ...task, status: next };
      })
    );
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: "New Pre-Project Task",
      status: "Not Started",
    };
    setTasks([...tasks, newTask]);
  };

  const clearTasks = () => {
    setTasks([]);
    localStorage.removeItem("metra_preproject_tasks");
  };

  return (
    <div className="preproject-wrapper">
      <div className="preproject-header">
        <div className="logo">METRA</div>
        <h1>PreProject Module</h1>
        <button className="return-summary">Return to Summary</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${
              task.status === "Completed"
                ? "task-complete"
                : task.status === "In Progress"
                ? "task-progress"
                : ""
            }`}
          >
            <div className="task-row">
              <span
                className={`task-title ${
                  task.status === "Completed" ? "line-through" : ""
                }`}
              >
                {task.title}
              </span>
              <div className="task-actions">
                <button
                  className="status-btn"
                  onClick={() => cycleStatus(task.id)}
                >
                  {task.status === "Not Started"
                    ? "Start"
                    : task.status === "In Progress"
                    ? "Complete"
                    : "Reset"}
                </button>
                <button
                  className="popup-btn"
                  onClick={() => handleOpenOverlay(task)}
                >
                  Open Popup
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="task-controls">
        <button onClick={addTask} className="add-btn">
          Add Task
        </button>
        <button onClick={clearTasks} className="clear-btn">
          Clear All
        </button>
      </div>

      {overlayVisible && (
        <PopupOverlayWrapper
          task={activeTask}
          onClose={handleCloseOverlay}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
