import { useState, useEffect } from "react";
import "../Styles/Checklist.css";

export default function PreProject() {
  const storageKey = "preprojectTasks";
  const [tasks, setTasks] = useState(() => {
    // ✅ Load from localStorage immediately on startup
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      console.warn("⚠️ Failed to parse stored tasks");
      return [];
    }
  });
  const [newTask, setNewTask] = useState("");

  // ✅ Save to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      console.log("💾 Tasks saved:", tasks);
    } catch (err) {
      console.error("❌ Save error:", err);
    }
  }, [tasks]);

  // ✅ Add task
  const addTask = () => {
    if (!newTask.trim()) return;
    const newItem = {
      text: newTask.trim(),
      status: "Not Started",
      timestamp: new Date().toLocaleString(),
    };
    const updated = [...tasks, newItem];
    setTasks(updated);
    setNewTask("");
    console.log("➕ Task added:", newItem);
  };

  // ✅ Delete task
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    console.log("🗑️ Task deleted at index:", index);
  };

  // ✅ Cycle status
  const cycleStatus = (index) => {
    const order = ["Not Started", "In Progress", "Completed"];
    const updated = [...tasks];
    const next =
      order[(order.indexOf(updated[index].status) + 1) % order.length];
    updated[index] = {
      ...updated[index],
      status: next,
      timestamp: new Date().toLocaleString(),
    };
    setTasks(updated);
    console.log("🔁 Status changed:", updated[index]);
  };

  // ✅ Clear all
  const clearAll = () => {
    if (window.confirm("Clear all tasks?")) {
      setTasks([]);
      localStorage.removeItem(storageKey);
      console.log("🧹 All tasks cleared");
    }
  };

  return (
    <div className="checklist-container">
      <header className="top-header">
        <h2>Pre-Project Checklist</h2>
      </header>

      <div className="add-task-row">
        <input
          type="text"
          placeholder="Add new pre-project task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>
          Add
        </button>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      <ul className="checklist">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`task-item status-${task.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            <span className="task-text" onClick={() => cycleStatus(index)}>
              {task.text}
            </span>
            <span className="status-label">{task.status}</span>
            <small className="timestamp">{task.timestamp}</small>
            <button className="delete-btn" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
