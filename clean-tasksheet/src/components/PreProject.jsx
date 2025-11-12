/* ======================================================================
   METRA – PreProject.jsx
   Phase 4.6B.13 Step 6A – Clean Task Sheet (Standalone Baseline – Fixed Seed)
   ----------------------------------------------------------------------
   • Ensures demo tasks seed on first load even if localStorage empty
   • Renders task list with 5-filter bar
   • Includes "Assign Person" button (inactive placeholder)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/PreProject.css";

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState(
    localStorage.getItem("filterStatus") || "All"
  );

  // Always ensure tasks are present
  useEffect(() => {
    const saved = localStorage.getItem("metraTasks");
    if (saved && JSON.parse(saved).length > 0) {
      setTasks(JSON.parse(saved));
    } else {
      const seed = [
        { id: 1, title: "Define project objectives", status: "Not Started" },
        { id: 2, title: "Draft initial plan", status: "In Progress" },
        { id: 3, title: "Check risk register", status: "Flagged" },
        { id: 4, title: "Approve funding", status: "Completed" },
      ];
      setTasks(seed);
      localStorage.setItem("metraTasks", JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("metraTasks", JSON.stringify(tasks));
    localStorage.setItem("filterStatus", filterStatus);
  }, [tasks, filterStatus]);

  const handleAssignPerson = (id) => {
    alert(`Assign Person clicked for task ${id} (inactive in clean build)`);
  };

  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  const statusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "#facc15";
      case "Completed":
        return "#16a34a";
      case "Flagged":
        return "#dc2626";
      default:
        return "#cbd5e1";
    }
  };

  return (
    <div className="preproject-container">
      <header className="preproject-header">
        <h1>PreProject – Task Workspace</h1>
      </header>

      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Flagged", "Completed"].map(
          (f) => (
            <button
              key={f}
              className={filterStatus === f ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilterStatus(f)}
            >
              {f}
            </button>
          )
        )}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks match this filter.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div
                className="status-dot"
                style={{ backgroundColor: statusColor(task.status) }}
              ></div>
              <span className="task-title">{task.title}</span>
              <button
                className="assign-btn"
                onClick={() => handleAssignPerson(task.id)}
              >
                Assign Person
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
