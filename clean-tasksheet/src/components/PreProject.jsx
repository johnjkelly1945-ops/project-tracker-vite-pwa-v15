/* ======================================================================
   METRA – PreProject.jsx
   Step 7B – 7 Dummy Tasks + Popup + Passive Assigned Name (Italic + Soft)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

/* ======================================================================
   RESTORED 7 DUMMY TASKS
   ====================================================================== */
const defaultTasks = [
  { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
  { id: 2, title: "Initial Risk Scan", status: "Not Started" },
  { id: 3, title: "Stakeholder Mapping", status: "Not Started" },
  { id: 4, title: "Identify Dependencies", status: "Not Started" },
  { id: 5, title: "Review Governance Requirements", status: "Not Started" },
  { id: 6, title: "Draft Initiation Brief", status: "Not Started" },
  { id: 7, title: "Validate Stakeholder List", status: "Not Started" }
];

export default function PreProject() {

  /* ===== Task Persistence ===== */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v3");
    return saved || "All";
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v3", filter);
  }, [filter]);

  /* ===== Active task & popups ===== */
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  /* ======================================================================
     FILTERING
     ====================================================================== */
  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Flagged") return t.flag === "orange" || t.flag === "red";
    return t.status === filter;
  });

  /* ======================================================================
     OPEN POPUPS
     ====================================================================== */
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

  /* ======================================================================
     ASSIGN PERSON
     ====================================================================== */
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

  /* ======================================================================
     NOTES
     ====================================================================== */
  const saveNotes = (taskId, entry) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, notes: t.notes ? [...t.notes, entry] : [entry] }
          : t
      )
    );
  };

  /* ======================================================================
     ARCHIVE TASK
     ====================================================================== */
  const archiveTask = (taskId) => {
    setTasks(prev => prev.filter((t) => t.id !== taskId));
  };

  /* ======================================================================
     FLAGS / ESCALATIONS
     ====================================================================== */
  const applyInternalFlag = (taskId) =>
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, flag: "orange" } : t)
    );

  const applyExternalFlag = (taskId) =>
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, flag: "red" } : t)
    );

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

  /* ======================================================================
     UI RENDER
     ====================================================================== */
  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Task Sheet</h1>

      {/* FILTERS */}
      <div className="filter-bar">
        {["All", "Flagged", "Not Started", "In Progress", "Completed", "On Hold"]
          .map((f) => (
            <button
              key={f}
              className={filter === f ? "filter-active" : "filter-btn"}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
      </div>

      {/* TASK LIST */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">

            {/* Whole left area opens popup */}
            <div
              className="task-left"
              onClick={() => openTaskWindow(task.id)}
            >
              <span className={`status-dot ${task.status.replace(/ /g, "-")}`} />

              {/* Flags */}
              {task.flag === "orange" && (
                <span className="flag-icon flag-orange">⚑</span>
              )}
              {task.flag === "red" && (
                <span className="flag-icon flag-red">⚑</span>
              )}

              {/* Title + assigned name (PASSIVE, NOT CLICKABLE) */}
              <span className="task-title">
                {task.title}

                {task.assigned && (
                  <span
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontStyle: "italic",
                      color: "#555",
                      cursor: "default",
                      pointerEvents: "auto",
                      marginLeft: "4px"
                    }}
                  >
                    — {task.assigned}
                  </span>
                )}
              </span>
            </div>

            {/* Assign Person */}
            <button
              className="assign-btn"
              onClick={() => startAssignPerson(task.id)}
            >
              Assign Person
            </button>

          </div>
        ))}
      </div>

      {/* ASSIGN OVERLAY */}
      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyPersonToTask}
          onClose={() => setShowAssignOverlay(false)}
        />
      )}

      {/* PERSONNEL DETAIL */}
      {showPersonnelDetail && activeTask && (
        <PersonnelDetail
          personName={activeTask.assigned}
          allTasks={tasks}
          onClose={() => setShowPersonnelDetail(false)}
        />
      )}

      {/* TASK POPUP */}
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
