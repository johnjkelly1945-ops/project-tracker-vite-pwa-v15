import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

console.log("✅ PreProject component loaded (Undo + scrollable)");

export default function PreProject() {
  const storageKey = "preproject-tasks";

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Cost benefit analysis completed", status: "Not started" },
          { text: "Feasibility study approved", status: "Not started" },
          { text: "Project charter signed", status: "Not started" },
        ];
  });

  const [newTask, setNewTask] = useState("");
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // --- Add a new task ---
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, status: "Not started" }]);
    setNewTask("");
  };

  // --- Delete with confirmation and Undo option ---
  const deleteTask = (index) => {
    const task = tasks[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.text}"?`
    );
    if (!confirmDelete) return;

    // Remove and store deleted task
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    setRecentlyDeleted(task);

    // Auto-clear undo after 10 seconds
    setTimeout(() => setRecentlyDeleted(null), 10000);
  };

  // --- Undo delete ---
  const undoDelete = () => {
    if (!recentlyDeleted) return;
    setTasks((prev) => [...prev, recentlyDeleted]);
    setRecentlyDeleted(null);
  };

  // --- Change task status ---
  const changeStatus = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    setTasks(updated);
  };

  return (
    <div className="checklist">
      <h2>Pre-Project Planning</h2>

      <ul>
        {tasks.map((task, i) => (
          <li
            key={i}
            className={
              task.status === "Not started"
                ? "status-not-started"
                : task.status === "In progress"
                ? "status-in-progress"
                : "status-completed"
            }
          >
            {task.text}
            <div>
              <select
                value={task.status}
                onChange={(e) => changeStatus(i, e.target.value)}
              >
                <option>Not started</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
              <button className="delete-btn" onClick={() => deleteTask(i)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="add-task">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      {recentlyDeleted && (
        <div className="undo-banner">
          <span>Task deleted.</span>
          <button onClick={undoDelete}>Undo</button>
        </div>
      )}
    </div>
  );
}
