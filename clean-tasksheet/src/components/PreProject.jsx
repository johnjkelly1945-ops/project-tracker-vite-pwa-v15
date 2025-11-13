import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import PersonnelDetail from "./PersonnelDetail.jsx";
import { PersonnelBridge } from "./Bridge/PersonnelBridge.js";
import "../Styles/PreProject.css";

export default function PreProject() {
  // ===== Default tasks =====
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started" }
  ];

  // ===== LocalStorage initial load =====
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v2");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v2");
    return saved || "All";
  });

  // ===== Overlay states =====
  const [assignOverlayOpen, setAssignOverlayOpen] = useState(false);
  const [detailOverlayOpen, setDetailOverlayOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  // ===== Persist tasks =====
  useEffect(() => {
    localStorage.setItem("tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v2", filter);
  }, [filter]);

  // ===== Filter tasks =====
  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    return t.status === filter;
  });

  // ===== Assignment handlers =====
  const handleAssignPerson = (taskId) => {
    setSelectedTaskId(taskId);
    setAssignOverlayOpen(true);
  };

  const applyPersonToTask = (personName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? { ...t, assigned: personName, status: "In Progress" }
          : t
      )
    );
    setAssignOverlayOpen(false);
  };

  // ===== Show personnel detail =====
  const openPersonDetail = (personName) => {
    const match = PersonnelBridge.getPersonnel().find(
      (p) => p.name === personName
    );

    if (match) {
      setSelectedPersonId(match.id);
      setDetailOverlayOpen(true);
    }
  };

  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Clean Task Sheet (Step 6F)</h1>

      {/* ===== Filter Bar ===== */}
      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "On Hold"].map(
          (f) => (
            <button
              key={f}
              className={filter === f ? "filter-active" : "filter-btn"}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* ===== Task List ===== */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-left">
              <span
                className={`status-dot ${task.status.replace(/ /g, "-")}`}
              ></span>

              <span className="task-title">
                {task.title}
                {task.assigned && (
                  <span
                    className="assigned-name"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => openPersonDetail(task.assigned)}
                  >
                    {" — "}{task.assigned}
                  </span>
                )}
              </span>
            </div>

            <div className="task-right">
              <button
                className="assign-btn"
                onClick={() => handleAssignPerson(task.id)}
              >
                Assign Person
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Assign Personnel Overlay ===== */}
      {assignOverlayOpen && (
        <PersonnelOverlay
          onClose={() => setAssignOverlayOpen(false)}
          onSelect={applyPersonToTask}
        />
      )}

      {/* ===== Personnel Detail Popup ===== */}
      {detailOverlayOpen && (
        <PersonnelDetail
          personId={selectedPersonId}
          onClose={() => setDetailOverlayOpen(false)}
        />
      )}
    </div>
  );
}
