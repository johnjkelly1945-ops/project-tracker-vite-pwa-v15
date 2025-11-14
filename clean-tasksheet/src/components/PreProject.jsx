/* ======================================================================
   METRA – PreProject.jsx
   Step 7 – Correct Click Behaviour (Title Only)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

/* ===== Default Tasks ===== */
const defaultTasks = [
  { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
  { id: 2, title: "Initial Risk Scan", status: "Not Started" },
  { id: 3, title: "Stakeholder Mapping", status: "Not Started" }
];

export default function PreProject() {

  /* ===== Load Persisted Tasks ===== */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v3");
    return saved || "All";
  });

  /* ===== Popup States ===== */
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const activeTask = tasks.find(t => t.id === activeTaskId);

  /* ===== Persist Changes ===== */
  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v3", filter);
  }, [filter]);

  /* ===== Open Windows ===== */
  const openTaskWindow = (taskId) => {
    setActiveTaskId(taskId);
    setShowWorkingWindow(true);
  };

  const startAssignPerson = (taskId) => {
    setActiveTaskId(taskId);
    setShowAssignOverlay(true);
  };

  const openPersonnelDetail = () => {
    setShowPersonnelDetail(true);
  };

  /* ===== Assign Person ===== */
  const applyPersonToTask = (personName) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === activeTaskId
          ? { ...t, assigned: personName, status: "In Progress" }
          : t
      )
    );
    setShowAssignOverlay(false);
  };

  /* ===== Notes ===== */
  const saveNotes = (taskId, entry) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, notes: t.notes ? [...t.notes, entry] : [entry] }
          : t
      )
    );
  };

  /* ===== Archive ===== */
  const archiveTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setShowWorkingWindow(false);
  };

  /* ===== Flags ===== */
  const applyInternalFlag = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, flag: "orange" } : t))
    );
  };

  const applyExternalFlag = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, flag: "red" } : t))
    );
  };

  const invokeCC = (taskId) => {
    saveNotes(taskId, "[CC – Internal]");
    applyInternalFlag(taskId);
  };

  const invokeQC = (taskId) => {
    saveNotes(taskId, "[QC – Internal QC]");
    applyInternalFlag(taskId);
  };

  const invokeEscalate = (taskId) => {
    saveNotes(taskId, "[Escalated – PMO External]");
    applyExternalFlag(taskId);
  };

  /* ===== Filtered Tasks ===== */
  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Flagged") return t.flag === "orange" || t.flag === "red";
    return t.status === filter;
  });

  /* ===== UI ===== */
  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Task Sheet</h1>

      {/* Filter Bar */}
      <div className="filter-bar">
        {["All", "Flagged", "Not Started", "In Progress", "Completed", "On Hold"]
          .map(f => (
            <button
              key={f}
              className={filter === f ? "filter-active" : "filter-btn"}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item">

            {/* ONLY TITLE clicks to open popup */}
            <div className="task-left">
              <span className={`status-dot ${task.status.replace(/ /g, "-")}`} />

              {/* Flag Icons */}
              {task.flag === "orange" && (
                <span className="flag-icon flag-orange">⚑</span>
              )}
              {task.flag === "red" && (
                <span className="flag-icon flag-red">⚑</span>
              )}

              {/* Title – only clickable part */}
              <span
                className="task-title clickable-title"
                onClick={() => openTaskWindow(task.id)}
              >
                {task.title}
              </span>

              {/* Assigned name (NOT clickable) */}
              {task.assigned && (
                <span className="assigned-name-nonclick"> — {task.assigned}</span>
              )}
            </div>

            {/* Assign Button */}
            <button
              className="assign-btn"
              onClick={() => startAssignPerson(task.id)}
            >
              Assign Person
            </button>

          </div>
        ))}
      </div>

      {/* Assign Overlay */}
      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyPersonToTask}
          onClose={() => setShowAssignOverlay(false)}
        />
      )}

      {/* Personnel Detail */}
      {showPersonnelDetail && activeTask && (
        <PersonnelDetail
          personName={activeTask.assigned}
          allTasks={tasks}
          onClose={() => setShowPersonnelDetail(false)}
        />
      )}

      {/* Task Popup */}
      {showWorkingWindow && activeTask && (
        <TaskWorkingWindow
          task={activeTask}
          onClose={() => setShowWorkingWindow(false)}
          onSaveNotes={saveNotes}
          onArchiveTask={archiveTask}
          onInvokeCC={() => invokeCC(activeTask.id)}
          onInvokeQC={() => invokeQC(activeTask.id)}
          onInvokeEscalate={() => invokeEscalate(activeTask.id)}
          onOpenPersonnelDetail={openPersonnelDetail}
        />
      )}

    </div>
  );
}
