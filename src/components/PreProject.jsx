import React, { useState, useEffect } from "react";
import PopupOverlayWrapper from "./PopupOverlayWrapper.jsx";

// 🔹 Force CSS to load properly
import "../Styles/PreProject.css";
import "../Styles/PreProject.css?inline";

export default function PreProject() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("metra_preproject_tasks_v3");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Define project objectives", status: "Not Started" },
      { id: 2, name: "Identify key stakeholders", status: "Not Started" },
      { id: 3, name: "Prepare feasibility summary", status: "Not Started" },
    ];
  });

  const [activeTask, setActiveTask] = useState(null);

  // 🔹 Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("metra_preproject_tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  // 🔹 Add a new task
  const addTask = () => {
    const newTask = { id: Date.now(), name: "New Entry", status: "Not Started" };
    setTasks((prev) => [...prev, newTask]);
  };

  // 🔹 Clear all tasks
  const clearTasks = () => {
    if (window.confirm("Clear all tasks?")) {
      setTasks([]);
      localStorage.removeItem("metra_preproject_tasks_v3");
    }
  };

  // 🔹 Toggle popup open
  const openPopup = (task) => setActiveTask(task);
  const closePopup = () => setActiveTask(null);

  return (
    <div className="preproject-container" style={{ padding: "2rem" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--header-blue)", color: "white", padding: "1rem 2rem", borderRadius: "12px", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>PreProject Module</h1>
        <button style={{ background: "white", color: "var(--header-blue)", padding: "0.5rem 1rem", border: "none", borderRadius: "6px", fontWeight: 600 }}>
          Return to Summary
        </button>
      </header>

      {tasks.map((task) => (
        <div key={task.id} className="bg-white" style={{ padding: "1rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{task.name}</span>
          <div>
            <button style={{ marginRight: "0.5rem", background: "#0a2b5c", color: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none" }}>
              {task.status === "Not Started" ? "Start" : "Complete"}
            </button>
            <button onClick={() => openPopup(task)} style={{ background: "#0078ff", color: "white", padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none" }}>
              Open Popup
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={addTask} style={{ background: "#0078ff", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", marginRight: "0.5rem" }}>Add Task</button>
        <button onClick={clearTasks} style={{ background: "gray", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none" }}>Clear All</button>
      </div>

      {/* 🔹 Popup Overlay */}
      {activeTask && (
        <PopupOverlayWrapper
          task={activeTask}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
