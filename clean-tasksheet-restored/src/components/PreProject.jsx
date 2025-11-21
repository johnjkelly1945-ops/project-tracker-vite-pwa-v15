/* ======================================================================
   METRA – PreProject.jsx
   Clean Baseline v4.6B.12 (2025-11-10 Verified)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/PreProject.css";

export default function PreProject() {
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started" }
  ];

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks_v3");
    return stored ? JSON.parse(stored) : defaultTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  return (
  <div className="preproject-container">
      <h1 className="header">METRA – PreProject</h1>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-row">
            <div className="task-title">{task.title}</div>
            <div className="task-status">{task.status}</div>
          </div>
        ))}
      </div>
  </div>
);

}
