// === METRA – PreProject Module (Clean Baseline Restore v3.0) ===
// Stable baseline: fully functional persistence, compact layout, no assignment duplication
// Baseline Tag: baseline-2025-10-21-preproject-restore-clean

import { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject({ setActiveModule }) {
  const storageKey = "preprojectTasks";
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");

  // Persist tasks
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // === Add Task ===
  const addTask = () => {
    if (!newTask.trim()) return;
    const timestamp = new Date().toLocaleString("en-GB");
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      status: "Not Started",
      timestamp,
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
  };

  // === Delete Task ===
  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // === Cycle Status ===
  const cycleStatus = (id) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          let newStatus;
          if (t.status === "Not Started") newStatus = "In Progress";
          else if (t.status === "In Progress") newStatus = "Completed";
          else newStatus = "Not Started";
          const updatedTime = new Date().toLocaleString("en-GB");
          return { ...t, status: newStatus, timestamp: updatedTime };
        }
        return t;
      })
    );
  };

  // === Status Colour Class ===
  const getStatusClass = (status) => {
    if (status === "In Progress") return "status-in-progress";
    if (status === "Completed") return "status-completed";
    return "status-not-started";
  };

  // === Render ===
  return (
    <div className="checklist-container">
      <div className="module-header-box inline">
        <span className="brand-large angled">METRA</span>
        <h2 className="module-subtitle">PreProject Module</h2>
        <button className="return-btn" onClick={() => setActiveModule("summary")}>
          Return to Summary
        </button>
      </div>

      <div className="checklist">
        <ul>
          {tasks.map((task) => (
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

          {/* Add New Task Row */}
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
