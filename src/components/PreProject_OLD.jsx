/* ======================================================================
   METRA – PreProject.jsx
   Phase 4.6B.13 Step 6C – Personnel Selection Overlay (Active Integration)
   ----------------------------------------------------------------------
   • Replaces alert with live personnel selector
   • Selecting a person marks task “In Progress” and stores assignment
   • Persists state via localStorage
   • No Governance / Template dependencies
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../Styles/PreProject.css";
import { PersonnelBridge } from "./Bridge/PersonnelBridge";

console.log("✅ Running Step 6C Personnel Overlay build");

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState(
    localStorage.getItem("filterStatus") || "All"
  );
  const [activeTaskId, setActiveTaskId] = useState(null);

  // ---- seed demo tasks ----
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
    else {
      const seed = [
        { id: 1, title: "Define project objectives", status: "Not Started" },
        { id: 2, title: "Draft initial plan", status: "Not Started" },
        { id: 3, title: "Check risk register", status: "Flagged" },
        { id: 4, title: "Approve funding", status: "Completed" },
      ];
      setTasks(seed);
      localStorage.setItem("tasks", JSON.stringify(seed));
    }
  }, []);

  // ---- persist updates ----
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("filterStatus", filterStatus);
  }, [tasks, filterStatus]);

  // ---- status dot colour ----
  const statusColor = (s) => {
    const v = s.toLowerCase();
    if (v.includes("not")) return "#9ca3af";
    if (v.includes("progress")) return "#3b82f6";
    if (v.includes("flag")) return "#f59e0b";
    if (v.includes("complete")) return "#16a34a";
    return "#d1d5db";
  };

  // ---- open/close selector ----
  const handleAssignPerson = (taskId) => {
    setActiveTaskId(taskId === activeTaskId ? null : taskId);
  };

  // ---- assign selected person ----
  const handleSelectPerson = (taskId, person) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, assigned: person.name, status: "In Progress" }
        : t
    );
    setTasks(updated);
    setActiveTaskId(null);
  };

  const personnel = PersonnelBridge.getPersonnel();
  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  return (
    <div className="preproject-container">
      <header className="header">
        <h1>PreProject – Task Workspace</h1>
      </header>

      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Flagged", "Completed"].map(
          (status) => (
            <button
              key={status}
              className={`filter-btn ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks match this filter.</div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div
                className="status-dot"
                style={{ backgroundColor: statusColor(task.status) }}
              ></div>

              <span className="task-title">{task.title}</span>

              {task.assigned && (
                <span className="assigned-label">👤 {task.assigned}</span>
              )}

              <button
                className="assign-btn"
                onClick={() => handleAssignPerson(task.id)}
              >
                {task.assigned ? "Reassign" : "Assign Person"}
              </button>

              {activeTaskId === task.id && (
                <div className="personnel-popup">
                  {personnel.map((p) => (
                    <button
                      key={p.id}
                      className="person-btn"
                      onClick={() => handleSelectPerson(task.id, p)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
