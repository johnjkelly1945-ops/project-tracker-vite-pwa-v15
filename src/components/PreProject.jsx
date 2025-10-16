// === METRA – PreProject Module with Filter Bar (Phase 1) ===
// Adds top filter controls while keeping header v2.5 styling intact
// Baseline Target: baseline-2025-10-19-preproject-filter

import { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject({ setActiveModule }) {
  const storageKey = "preprojectTasks";
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const timestamp = new Date().toLocaleString("en-GB");
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      status: "Not Started",
      timestamp,
      flagged: false, // future use
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const cycleStatus = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let newStatus;
          if (task.status === "Not Started") newStatus = "In Progress";
          else if (task.status === "In Progress") newStatus = "Completed";
          else newStatus = "Not Started";
          const updatedTime = new Date().toLocaleString("en-GB");
          return { ...task, status: newStatus, timestamp: updatedTime };
        }
        return task;
      })
    );
  };

  const getStatusClass = (status) => {
    if (status === "In Progress") return "status-in-progress";
    if (status === "Completed") return "status-completed";
    return "status-not-started";
  };

  // === Filter logic ===
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Flagged") return task.flagged === true;
    return task.status === filter;
  });

  // === Render ===
  return (
    <div className="checklist-container">
      {/* === Unified METRA Header === */}
      <div className="module-header-box inline">
        <span className="brand-large angled">METRA</span>
        <h2 className="module-subtitle">PreProject Module</h2>
        <button className="return-btn" onClick={() => setActiveModule("summary")}>
          Return to Summary
        </button>
      </div>

      {/* === Filter Bar === */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "Flagged"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* === Checklist === */}
      <div className="checklist">
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={`task-item ${getStatusClass(task.status)}`}>
              <div className="task-text-area">
                <span className="task-text">{task.text}</span>
              </div>

              <div className="task-controls">
                <button
                  className="status-btn"
                  onClick={() => cycleStatus(task.id)}
                  title="Click to change status"
                >
                  {task.status}
                </button>
                <span className="timestamp">{task.timestamp}</span>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}

          <li className="task-item add-row">
            <div className="task-text-area">
              <input
                type="text"
                placeholder="Add new pre-project task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="task-controls">
              <button className="add" onClick={addTask}>
                Add
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
