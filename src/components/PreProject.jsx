// src/components/PreProject.jsx
import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject() {
  const storageKey = "preproject-tasks";

  // ✅ Load saved tasks or use default four
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

  // ✅ Persist tasks
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // === Actions ===
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask.trim(), status: "Not started" }]);
    setNewTask("");
  };

  const handleDelete = (index) => {
    const deleted = tasks[index];
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    setRecentlyDeleted(deleted);
  };

  const handleUndo = () => {
    if (!recentlyDeleted) return;
    setTasks([...tasks, recentlyDeleted]);
    setRecentlyDeleted(null);
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    updated[index].date = new Date().toLocaleString(); // date-stamp
    setTasks(updated);
  };

  return (
    <div className="checklist">
      <h2>Pre-Project Checklist</h2>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          placeholder="Add a new task"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`status-${task.status.toLowerCase().replace(" ", "-")}`}
          >
            <span>
              {task.text}
              {task.date && (
                <small style={{ display: "block", opacity: 0.7 }}>
                  {task.date}
                </small>
              )}
            </span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
            >
              <option>Not started</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
            <button className="delete-btn" onClick={() => handleDelete(index)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {recentlyDeleted && (
        <div className="undo-banner">
          <p>Task deleted.</p>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </div>
  );
}
