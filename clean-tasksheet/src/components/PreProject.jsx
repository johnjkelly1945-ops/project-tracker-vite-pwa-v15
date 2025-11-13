import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import "../Styles/PreProject.css";

export default function PreProject() {
  // ===== Default tasks for first-time load =====
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started" }
  ];

  // ===== LocalStorage initial load =====
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v2");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v2");
    return saved || "All";
  });

  // ===== Overlay State =====
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // ===== Persist tasks on any change =====
  useEffect(() => {
    localStorage.setItem("tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v2", filter);
  }, [filter]);

  // ===== Filters =====
  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  // ===== Handle assigning a person =====
  const handleAssignPerson = (taskId) => {
    setSelectedTaskId(taskId);
    setOverlayOpen(true);
  };

  const applyPersonToTask = (personName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? { ...t, assigned: personName, status: "In Progress" }
          : t
      )
    );
    setOverlayOpen(false);
  };

  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Clean Task Sheet (Step 6C)</h1>

      {/* ===== Filter Bar ===== */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "On Hold"].map(
          (f) => (
            <button
              key={f}
              className={filter === f ? "filter-active" : "filter-btn"}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* ===== Task List ===== */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-left">
              <span
                className={`status-dot ${task.status.replace(/ /g, "-")}`}
              ></span>

              <span className="task-title">
                {task.title}
                {task.assigned && (
                  <span className="assigned-name"> — {task.assigned}</span>
                )}
              </span>
            </div>

            <div className="task-right">
              <button
                className="assign-btn"
                onClick={() => handleAssignPerson(task.id)}
              >
                Assign Person
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Personnel Overlay ===== */}
      {overlayOpen && (
        <PersonnelOverlay
          onClose={() => setOverlayOpen(false)}
          onSelect={applyPersonToTask}
        />
      )}
    </div>
  );
}
