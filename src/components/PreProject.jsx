/* ======================================================================
   METRA – PreProject.jsx
   Stage 3.2 – Workspace Content View (No Internal Header)
   ----------------------------------------------------------------------
   Internal “METRA – PreProject” header removed because the global
   header now sits above the dual pane layout.
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
      {/* Main title removed — now in the global header */}

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
