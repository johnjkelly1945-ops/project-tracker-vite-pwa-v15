/* ======================================================================
   METRA – PreProject.jsx (FINAL – Summary Sorting + Robust Dedupe)
   Works with new RepositoryModule
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

/* ======================================================================
   Toast Confirm Component
   ====================================================================== */
function ToastConfirm({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        padding: "14px 18px",
        borderRadius: "8px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        zIndex: 9999,
        width: "260px",
        border: "1px solid #d0d0d0"
      }}
    >
      <div style={{ marginBottom: "12px", fontWeight: 600 }}>{message}</div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#eee",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#dc2626",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ======================================================================
   Default Tasks (stay as normal tasks)
   ====================================================================== */
const defaultTasks = [
  { id: 1, title: "Prepare Scope Summary", status: "Not Started", type: "task" },
  { id: 2, title: "Initial Risk Scan", status: "Not Started", type: "task" },
  { id: 3, title: "Stakeholder Mapping", status: "Not Started", type: "task" },
  { id: 4, title: "Identify Dependencies", status: "Not Started", type: "task" },
  { id: 5, title: "Review Governance Requirements", status: "Not Started", type: "task" },
  { id: 6, title: "Draft Initiation Brief", status: "Not Started", type: "task" },
  { id: 7, title: "Validate Stakeholder List", status: "Not Started", type: "task" }
];

/* ======================================================================
   Title normalisation for dedupe
   ====================================================================== */
function normalise(str) {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
}

export default function PreProject({
  setScreen,
  injectedTasks = [],
  clearInjectedTasks = () => {}
}) {

  /* ======================================================================
     Load tasks or defaults
     ====================================================================== */
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

  /* ======================================================================
     MERGE INJECTED TASKS WITH DEDUPE (title + type)
     ====================================================================== */
  useEffect(() => {
    if (injectedTasks && injectedTasks.length > 0) {
      setTasks(prev => {
        const existing = new Set(prev.map(t => normalise(t.title) + "::" + t.type));
        const clean = injectedTasks.filter(
          t => !existing.has(normalise(t.title) + "::" + t.type)
        );
        return [...prev, ...clean];
      });
      clearInjectedTasks();
    }
  }, [injectedTasks, clearInjectedTasks]);

  /* ======================================================================
     Popup State
     ====================================================================== */
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  /* ======================================================================
     SUMMARY DELETE (Toast)
     ====================================================================== */
  const [summaryToDelete, setSummaryToDelete] = useState(null);

  const deleteSummaryNow = () => {
    setTasks(prev =>
      prev.filter(t => String(t.id) !== String(summaryToDelete))
    );
    setSummaryToDelete(null);
  };

  /* ======================================================================
     Actions
     ====================================================================== */
  const openTaskWindow = (taskId) => {
    setActiveTaskId(taskId);
    setShowWorkingWindow(true);
  };

  const startAssignPerson = (taskId) => {
    setActiveTaskId(taskId);
    setShowAssignOverlay(true);
  };

  const openPersonnelDetail = () => setShowPersonnelDetail(true);

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

  const saveNotes = (taskId, entry) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, notes: t.notes ? [...t.notes, entry] : [entry] }
          : t
      )
    );
  };

  const archiveTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const applyInternalFlag = (taskId) =>
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, flag: "orange" } : t));

  const applyExternalFlag = (taskId) =>
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, flag: "red" } : t));

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

  const toggleSummary = (taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, expanded: !t.expanded } : t
      )
    );
  };

  /* ======================================================================
     SORTING BEFORE RENDER:
     1. All summaries at top
     2. All tasks below
     ====================================================================== */
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.type === "summary" && b.type !== "summary") return -1;
    if (a.type !== "summary" && b.type === "summary") return 1;
    return a.title.localeCompare(b.title);
  });

  /* ======================================================================
     FILTERING AFTER SORT (preserves summary visibility)
     ====================================================================== */
  const visibleTasks = sortedTasks.filter((t) => {
    if (t.type === "summary") return true; 
    if (filter === "All") return true;
    if (filter === "Flagged") return t.flag === "orange" || t.flag === "red";
    return t.status === filter;
  });

  /* ======================================================================
     RENDER
     ====================================================================== */
  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Task Sheet</h1>

      {/* FILTER BAR */}
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

      {/* TASK LIST */}
      <div className="task-list">
        {visibleTasks.map((t) => {

          /* ================================================================
             SUMMARY ROW
             ================================================================ */
          if (t.type === "summary") {
            return (
              <div key={t.id}>
                <div className="summary-row">
                  <span
                    className="summary-arrow"
                    onClick={() => toggleSummary(t.id)}
                  >
                    {t.expanded ? "▼" : "▶"}
                  </span>

                  <span className="summary-dot"></span>

                  <span
                    className="task-title"
                    onClick={() => toggleSummary(t.id)}
                  >
                    {t.title}
                  </span>

                  {/* DELETE SUMMARY */}
                  <span
                    style={{
                      marginLeft: "auto",
                      cursor: "pointer",
                      color: "#444",
                      fontSize: "18px",
                      padding: "2px 6px"
                    }}
                    onClick={() => setSummaryToDelete(t.id)}
                  >
                    ✕
                  </span>
                </div>

                {t.expanded && (
                  <div className="child-task-wrapper">
                    {/* future child tasks */}
                  </div>
                )}
              </div>
            );
          }

          /* ================================================================
             NORMAL TASK ROW
             ================================================================ */
          return (
            <div key={t.id} className="task-item">
              <div className="task-left" onClick={() => openTaskWindow(t.id)}>

                <span className={`status-dot ${t.status.replace(/ /g, "-")}`}></span>

                {t.flag === "orange" && (
                  <span className="flag-icon flag-orange">⚑</span>
                )}
                {t.flag === "red" && (
                  <span className="flag-icon flag-red">⚑</span>
                )}

                <span className="task-title">
                  {t.title}
                  {t.assigned && (
                    <span
                      style={{
                        fontStyle: "italic",
                        color: "#555",
                        marginLeft: "4px"
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      — {t.assigned}
                    </span>
                  )}
                </span>
              </div>

              <button
                className="assign-btn"
                onClick={() => startAssignPerson(t.id)}
              >
                Assign Person
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD TASK */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="add-task-btn" onClick={() => setScreen("repository")}>
          + Add Task
        </button>
      </div>

      {/* TOAST DELETE */}
      {summaryToDelete && (
        <ToastConfirm
          message="Delete this summary?"
          onConfirm={deleteSummaryNow}
          onCancel={() => setSummaryToDelete(null)}
        />
      )}

      {/* POPUPS */}
      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyPersonToTask}
          onClose={() => setShowAssignOverlay(false)}
        />
      )}

      {showPersonnelDetail && activeTask && (
        <PersonnelDetail
          personName={activeTask.assigned}
          allTasks={tasks}
          onClose={() => setShowPersonnelDetail(false)}
        />
      )}

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
