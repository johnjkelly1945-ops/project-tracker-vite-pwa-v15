// src/components/Progress.jsx
import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function Progress() {
  const storageKey = "progress-tasks";

  // Load saved tasks or default four
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Design specification completed", status: "Not started" },
          { text: "Procurement process begun", status: "In progress" },
          { text: "Site preparation underway", status: "Completed" },
          { text: "Stakeholder review scheduled", status: "Not started" },
        ];
  });

  const [newTask, setNewTask] = useState("");

  // Persist changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  // Cycle through statuses
  const cycleStatus = (index) => {
    const order = ["Not started", "In progress", "Completed"];
    setTasks((prev) => {
      const updated = [...prev];
      const currentIndex = order.indexOf(prev[index].status);
      const nextStatus = order[(currentIndex + 1) % order.length];
      updated[index] = {
        ...prev[index],
        status: nextStatus,
        timestamp: new Date().toLocaleString(),
      };
      return updated;
    });
  };

  // Delete task with confirmation
  const deleteTask = (index) => {
    if (window.confirm(`Delete "${tasks[index].text}"?`)) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // Add new task
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, status: "Not started" }]);
    setNewTask("");
  };

  // --- MAIN RENDER ---
  return (
    <div style={{ width: "95%", maxWidth: "1200px", margin: "0 auto" }}>
      <ModuleHeader title="Progress Module" />
      <div className="checklist">
        <h2>Progress Checklist</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <span>
                {task.text}
                {task.timestamp && (
                  <small style={{ marginLeft: "8px", color: "#666" }}>
                    ({task.timestamp})
                  </small>
                )}
              </span>
              <div>
                <button
                  className={`status-btn ${
                    task.status === "Not started"
                      ? "status-not-started"
                      : task.status === "In progress"
                      ? "status-in-progress"
                      : "status-completed"
                  }`}
                  onClick={() => cycleStatus(index)}
                >
                  {task.status}
                </button>
                <button className="delete-btn" onClick={() => deleteTask(index)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="add-task">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
    </div>
  );
}
