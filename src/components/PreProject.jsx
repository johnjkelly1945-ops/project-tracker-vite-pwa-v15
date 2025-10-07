// src/components/PreProject.jsx
import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function PreProject() {
  const storageKey = "preproject-tasks";

  // Load saved tasks or defaults
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Feasibility study approved", status: "Not started" },
          { text: "Project team identified", status: "In progress" },
          { text: "Cost–benefit analysis completed", status: "Completed" },
          { text: "Project plan drafted", status: "Not started" },
        ];
  });

  const [newTask, setNewTask] = useState("");
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask.trim(), status: "Not started" }]);
    setNewTask("");
  };

  // Delete a task
  const deleteTask = (index) => {
    const deleted = tasks[index];
    setRecentlyDeleted(deleted);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Undo a deleted task
  const undoDelete = () => {
    if (!recentlyDeleted) return;
    setTasks([...tasks, recentlyDeleted]);
    setRecentlyDeleted(null);
  };

  // Change a task’s status and timestamp it
  const handleStatusChange = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    updated[index].timestamp = new Date().toLocaleString();
    setTasks(updated);
  };

  // Truncate long text safely
  const truncate = (s, n = 60) =>
    s && s.length > n ? `${s.slice(0, n)}…` : s || "";

  // Render component
  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />

      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`status-${task.status.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="row">
              <span>{task.text}</span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <option>Not started</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
              <button className="delete-btn" onClick={() => deleteTask(index)}>
                Delete
              </button>
            </div>

            {task.timestamp && (
              <small className="timestamp">Updated: {task.timestamp}</small>
            )}
          </li>
        ))}
      </ul>

      {recentlyDeleted && (
        <div className="undo-banner">
          <span className="deleted-label">Deleted:</span>
          <span className="deleted-text">{truncate(recentlyDeleted.text)}</span>
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}

      <div className="add-task">
        <input
          type="text"
          placeholder="New task…"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
