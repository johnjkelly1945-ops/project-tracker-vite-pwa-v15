import { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function PreProject() {
  const STORAGE_KEY = "preprojectTasks";
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
      setHasLoaded(true);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }, []);

  // Save after initial load
  useEffect(() => {
    if (hasLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        console.error("Error saving tasks:", err);
      }
    }
  }, [tasks, hasLoaded]);

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

  const updateStatus = (index, status) => {
    const updated = [...tasks];
    updated[index].status = status;
    updated[index].timestamp = new Date().toLocaleString();
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "status-completed";
    if (status === "In progress") return "status-in-progress";
    return "status-not-started";
  };

  return (
    <div className="checklist preproject">
      <ModuleHeader title="PreProject Module" />
      <h2>Pre-Project Checklist</h2>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${getStatusClass(task.status)}`}>
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
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(index)}
                >
                  Delete
                </button>
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
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
      </div>
    </div>
  );
}
