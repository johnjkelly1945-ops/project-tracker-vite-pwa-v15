import { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function PreProject() {
  const STORAGE_KEY = "preprojectTasks";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // ✅ Load saved tasks
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch (err) {
      console.error("Load error:", err);
    }
  }, []);

  // ✅ Save tasks whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [tasks]);

  // ➕ Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [
      ...tasks,
      {
        text: newTask.trim(),
        status: "Not started",
        timestamp: new Date().toLocaleString(),
      },
    ];
    setTasks(updated);
    setNewTask("");
  };

  // 🔁 Update status
  const updateStatus = (index, status) => {
    const updated = [...tasks];
    updated[index].status = status;
    updated[index].timestamp = new Date().toLocaleString();
    setTasks(updated);
  };

  // ❌ Delete task
  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />
      <h2>Pre-Project Checklist</h2>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={`task-item status-${task.status.replace(" ", "-")}`}>
            <div className="task-row">
              <span className={task.status === "Completed" ? "done" : ""}>
                {task.text}
              </span>

              <div className="task-controls">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(index, e.target.value)}
                >
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </div>
            <div className="timestamp">Last updated: {task.timestamp}</div>
          </li>
        ))}
      </ul>

      <div className="add-row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task…"
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div>
  );
}
