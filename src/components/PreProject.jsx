import { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function PreProject() {
  const STORAGE_KEY = "preprojectTasks";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load saved tasks
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch (err) {
      console.warn("Load error:", err);
    }
  }, []);

  // Save tasks on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn("Save error:", err);
    }
  }, [tasks]);

  // Add new task
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

  // Update status
  const updateStatus = (i, s) => {
    const updated = [...tasks];
    updated[i].status = s;
    updated[i].timestamp = new Date().toLocaleString();
    setTasks(updated);
  };

  // Delete task
  const del = (i) => setTasks(tasks.filter((_, x) => x !== i));

  // Return full UI
  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />
      <h2>Pre-Project Checklist</h2>

      <ul>
        {tasks.map((t, i) => (
          <li key={i} className={`status-${t.status.replace(" ", "-")}`}>
            <div className="task-line">
              <span className={t.status === "Completed" ? "done" : ""}>
                {t.text}
              </span>
              <div>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(i, e.target.value)}
                >
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
                <button onClick={() => del(i)}>Delete</button>
              </div>
            </div>
            <small>Last updated: {t.timestamp}</small>
          </li>
        ))}
      </ul>

      <div className="add-row">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task…"
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div>
  );
}
