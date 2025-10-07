// src/components/PreProject.jsx
import React, { useState, useEffect } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

export default function PreProject() {
 const storageKey = "preproject-tasks";


  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem = {
      id: Date.now(),
      text: newTask,
      status: "Not Started",
      dateAdded: new Date().toLocaleString(),
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const updateStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: newStatus, dateUpdated: new Date().toLocaleString() }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="checklist-container">
      <ModuleHeader moduleName="PreProject" />

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>PreProject Checklist</h2>

      <div className="input-area">
        <input
          type="text"
          value={newTask}
          placeholder="Enter new task..."
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No tasks added yet.</p>
      ) : (
        <ul className="checklist">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`status-${task.status.toLowerCase().replace(" ", "-")}`}
            >
              <span>{task.text}</span>
              <div className="buttons">
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
