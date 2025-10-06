import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";

console.log("✅ Closure component loaded (with delete confirmation)");

export default function Closure() {
  const storageKey = "closure-tasks";

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Final deliverables approved", status: "Not started" },
          { text: "Client sign-off received", status: "Not started" },
          { text: "Post-project review completed", status: "Not started" },
        ];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // --- Add new task ---
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, status: "Not started" }]);
    setNewTask("");
  };

  // --- Confirm before delete ---
  const deleteTask = (index) => {
    const task = tasks[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.text}"?`
    );
    if (confirmDelete) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // --- Change task status ---
  const changeStatus = (index, newStatus) => {
    const updated = [...tasks];
    updated[index].status = newStatus;
    setTasks(updated);
  };

  return (
    <div className="checklist">
      <h2>Project Closure</h2>

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
    </div>
  );
}
