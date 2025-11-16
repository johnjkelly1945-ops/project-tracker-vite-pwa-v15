/* ======================================================================
   METRA – PreProject.jsx
   FINAL BASELINE – Clean Storage / Normalised IDs / Stable Assignment
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

/* ================================================================
   FORCE CLEAN RESET (Option B)
   ================================================================ */
localStorage.removeItem("task_summaries_v3");
localStorage.removeItem("task_items_v3");
localStorage.removeItem("task_filter_v3");

/* ================================================================
   DEFAULT SUMMARIES (all IDs as strings)
   ================================================================ */
const defaultSummaries = [
  { id: "S1", title: "Project Management Summary", type: "summary", expanded: false },
  { id: "S2", title: "Governance Summary", type: "summary", expanded: false }
];

/* ================================================================
   DEFAULT NORMAL TASKS (all IDs as strings)
   ================================================================ */
const defaultTasks = [
  { id: "T1", title: "Prepare Scope Summary", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T2", title: "Initial Risk Scan", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T3", title: "Stakeholder Mapping", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T4", title: "Identify Dependencies", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T5", title: "Review Governance Requirements", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T6", title: "Draft Initiation Brief", status: "Not Started", type: "task", assigned: null, notes: [], flag: null },
  { id: "T7", title: "Validate Stakeholder List", status: "Not Started", type: "task", assigned: null, notes: [], flag: null }
];

/* ================================================================
   NORMALISERS (ensure all entries safe & complete)
   ================================================================ */
const normaliseTask = (t) => ({
  id: String(t.id),
  title: t.title || "Untitled Task",
  type: "task",
  status: t.status || "Not Started",
  assigned: t.assigned || null,
  notes: Array.isArray(t.notes) ? t.notes : [],
  flag: t.flag || null
});

const normaliseSummary = (s) => ({
  id: String(s.id),
  title: s.title || "Untitled Summary",
  type: "summary",
  expanded: typeof s.expanded === "boolean" ? s.expanded : false
});

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function PreProject({ setScreen, injectedTasks, clearInjectedTasks }) {

  /* ================================================================
     CLEAN FRESH STORAGE on first load
     ================================================================ */
  const [summaries, setSummaries] = useState(defaultSummaries);
  const [tasks, setTasks] = useState(defaultTasks);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("task_summaries_v3", JSON.stringify(summaries));
  }, [summaries]);

  useEffect(() => {
    localStorage.setItem("task_items_v3", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v3", filter);
  }, [filter]);

  /* ================================================================
     MERGE DOWNLOADED TASKS (IDs always strings)
     ================================================================ */
  useEffect(() => {
    if (!injectedTasks || injectedTasks.length === 0) return;

    const incomingSummaries = injectedTasks.filter(t => t.type === "summary");
    const incomingTasks = injectedTasks.filter(t => t.type === "task");

    if (incomingSummaries.length > 0) {
      setSummaries(prev => [
        ...prev,
        ...incomingSummaries
          .filter(ns => !prev.some(s => s.title === ns.title))
          .map(normaliseSummary)
      ]);
    }

    if (incomingTasks.length > 0) {
      setTasks(prev => [
        ...prev,
        ...incomingTasks
          .filter(nt => !prev.some(t => t.title === nt.title))
          .map(normaliseTask)
      ]);
    }

    clearInjectedTasks();
  }, [injectedTasks, clearInjectedTasks]);

  /* ================================================================
     POPUP & PERSONNEL LOGIC
     ================================================================ */
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const openTaskPopup = (id) => {
    setActiveTaskId(String(id));
    setShowWorkingWindow(true);
  };

  const startAssign = (id) => {
    setActiveTaskId(String(id));
    setShowAssignOverlay(true);
  };

  const applyAssign = (personObj) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === activeTaskId
          ? normaliseTask({ ...t, assigned: personObj.name, status: "In Progress" })
          : t
      )
    );
    setShowAssignOverlay(false);
  };

  const markCompleted = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? normaliseTask({ ...t, status: "Completed" })
          : t
      )
    );
  };

  const archiveTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const saveNotes = (id, entry) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? normaliseTask({ ...t, notes: [...(t.notes || []), entry] })
          : t
      )
    );
  };

  /* ================================================================
     SUMMARY EXPANSION
     ================================================================ */
  const toggleSummary = (id) => {
    setSummaries(prev =>
      prev.map(s => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  };

  /* ================================================================
     FILTERING ((Task ONLY))
     ================================================================ */
  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Flagged") return t.flag === "orange" || t.flag === "red";
    return t.status === filter;
  });

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div className="preproject-wrapper">

      <h1>PreProject – Task Sheet</h1>

      {/* FILTER BAR */}
      <div className="filter-bar">
        {["All", "Flagged", "Not Started", "In Progress", "Completed", "On Hold"].map(f => (
          <button
            key={f}
            className={filter === f ? "filter-active" : "filter-btn"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ============================================================
         SUMMARIES (always visible)
         ============================================================ */}
      {summaries.map(summary => (
        <div key={summary.id}>
          <div
            className="summary-row"
            onClick={() => toggleSummary(summary.id)}
          >
            <span className="summary-dot" />
            <span className="task-title">{summary.title}</span>
            <span className="summary-arrow">
              {summary.expanded ? "▼" : "►"}
            </span>
          </div>

          {/* CHILD TASKS */}
          {summary.expanded && (
            <div>
              {filteredTasks.map(t => (
                <div key={t.id} className="task-item">
                  <div className="task-left" onClick={() => openTaskPopup(t.id)}>
                    <span className={`status-dot ${t.status.replace(/ /g, "-")}`} />

                    {/* TITLE ONLY triggers popup */}
                    <span className="task-title">{t.title}</span>

                    {/* ASSIGNED NAME (NOT clickable) */}
                    {t.assigned && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontStyle: "italic",
                          color: "#555",
                          cursor: "default"
                        }}
                      >
                        — {t.assigned}
                      </span>
                    )}
                  </div>

                  <button className="assign-btn" onClick={() => startAssign(t.id)}>
                    Assign Person
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ============================================================
         NORMAL TASK LIST (only if no summary expanded)
         ============================================================ */}
      {!summaries.some(s => s.expanded) && (
        <div className="task-list">
          {filteredTasks.map(t => (
            <div key={t.id} className="task-item">
              <div className="task-left" onClick={() => openTaskPopup(t.id)}>
                <span className={`status-dot ${t.status.replace(/ /g, "-")}`} />
                <span className="task-title">{t.title}</span>
                {t.assigned && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontStyle: "italic",
                      color: "#555",
                      cursor: "default"
                    }}
                  >
                    — {t.assigned}
                  </span>
                )}
              </div>

              <button className="assign-btn" onClick={() => startAssign(t.id)}>
                Assign Person
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD TASK BUTTON */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="add-task-btn" onClick={() => setScreen("repository")}>
          + Add Task
        </button>
      </div>

      {/* OVERLAYS */}
      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyAssign}
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
          onInvokeCC={() => {}}
          onInvokeQC={() => {}}
          onInvokeEscalate={() => {}}
          onOpenPersonnelDetail={() => setShowPersonnelDetail(true)}
          onMarkCompleted={markCompleted}
        />
      )}

    </div>
  );
}
