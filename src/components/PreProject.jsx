/* ======================================================================
   METRA – PreProject.jsx
   Branch: feature-preproject-popup-integration-phase2
   Baseline target: baseline-2025-10-30-preproject-popup-integration-phase2-v2.0
   ----------------------------------------------------------------------
   - Full PreProject UI restored (blue header, filters, white task cards)
   - Universal Popup (PopupUniversal.jsx) integrated per task
   - Close / Save / Reset functional
   - Local persistence retained
   - Smooth scroll + state restore verified
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PopupUniversal from "./PopupUniversal.jsx";
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
  const [popupVisible, setPopupVisible] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("metra_preproject_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleOpenPopup = (task) => {
    setActiveTask(task);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setActiveTask(null);
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

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div className="preproject-wrapper">
      <div className="preproject-header">
        <div className="logo">METRA</div>
        <h1>PreProject Module</h1>
        <button className="return-summary">Return to Summary</button>
      </div>

      <div className="filter-buttons">
        {["All", "Not Started", "In Progress", "Completed"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
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
                  onClick={() => handleOpenPopup(task)}
                >
                  Log / Popup
                </button>
                <button
                  className="delete-btn"
                  onClick={() =>
                    setTasks(tasks.filter((t) => t.id !== task.id))
                  }
                >
                  Delete
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

      {popupVisible && activeTask && (
        <PopupUniversal
          key={activeTask.id}
          taskId={activeTask.id}
          taskTitle={activeTask.title}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
