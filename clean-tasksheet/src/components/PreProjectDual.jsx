/* ======================================================================
   METRA – PreProjectDual.jsx (v5 FINAL)
   Side-by-side panes • Fullscreen per-pane • Independent scroll
   Sticky header + sticky filters • Chrome + Safari verified
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import "../Styles/PreProjectDual.css";

/* ---------------------------------------------------------------
   DEFAULT DATA
   --------------------------------------------------------------- */
const defaultMgmt = [
  { id: "MS1", type: "summary", title: "Management Summary", expanded: false },
  { id: "MT1", type: "task", title: "Define Governance Approach", status: "Not Started", assigned: null, notes: [] },
  { id: "MT2", type: "task", title: "Identify Stakeholders", status: "Not Started", assigned: null, notes: [] }
];

const defaultDev = [
  { id: "DS1", type: "summary", title: "Development Summary", expanded: false },
  { id: "DT1", type: "task", title: "Draft Requirements", status: "Not Started", assigned: null, notes: [] },
  { id: "DT2", type: "task", title: "Initial Technical Assessment", status: "Not Started", assigned: null, notes: [] }
];

const normalise = (item) => ({
  ...item,
  id: String(item.id),
  expanded: item.type === "summary" ? !!item.expanded : false,
  status: item.type === "task" ? item.status || "Not Started" : undefined,
  assigned: item.type === "task" ? item.assigned || null : undefined,
  notes: item.type === "task" ? item.notes || [] : undefined
});

/* ====================================================================== */

export default function PreProjectDual({ setScreen }) {

  /* ---------------------------------------------------------------
     STORAGE + LOADERS
     --------------------------------------------------------------- */
  const STORAGE_MGMT = "tasks_mgmt_v1";
  const STORAGE_DEV = "tasks_dev_v1";

  const loadMgmt = () => {
    const s = localStorage.getItem(STORAGE_MGMT);
    if (!s) return defaultMgmt.map(normalise);
    try { return JSON.parse(s).map(normalise); }
    catch { return defaultMgmt.map(normalise); }
  };

  const loadDev = () => {
    const s = localStorage.getItem(STORAGE_DEV);
    if (!s) return defaultDev.map(normalise);
    try { return JSON.parse(s).map(normalise); }
    catch { return defaultDev.map(normalise); }
  };

  const [mgmtItems, setMgmtItems] = useState(loadMgmt);
  const [devItems, setDevItems] = useState(loadDev);

  useEffect(() => {
    localStorage.setItem(STORAGE_MGMT, JSON.stringify(mgmtItems));
  }, [mgmtItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_DEV, JSON.stringify(devItems));
  }, [devItems]);

  /* ---------------------------------------------------------------
     FULLSCREEN CONTROL
     --------------------------------------------------------------- */
  // fullscreen = "mgmt", "dev", or null
  const [fullscreen, setFullscreen] = useState(null);

  const toggleFullscreen = (pane) => {
    setFullscreen(prev => (prev === pane ? null : pane));
  };

  /* ---------------------------------------------------------------
     ASSIGN OVERLAY
     --------------------------------------------------------------- */
  const [assignTarget, setAssignTarget] = useState(null);
  const [showAssign, setShowAssign] = useState(false);

  const startAssign = (paneSetter, id) => {
    setAssignTarget({ paneSetter, id });
    setShowAssign(true);
  };

  const applyAssign = (personObj) => {
    if (!assignTarget) return;
    const { paneSetter, id } = assignTarget;

    paneSetter(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, assigned: personObj.name, status: "In Progress" }
          : i
      )
    );

    setShowAssign(false);
    setAssignTarget(null);
  };

  /* ---------------------------------------------------------------
     FILTERS
     --------------------------------------------------------------- */
  const [mgmtFilter, setMgmtFilter] = useState("All");
  const [devFilter, setDevFilter] = useState("All");

  const applyFilter = (items, filter) => {
    if (filter === "All") return items;
    return items.filter(i => i.status === filter);
  };

  /* ---------------------------------------------------------------
     Add Summary / Add Task
     --------------------------------------------------------------- */
  const addSummary = (paneSetter) => {
    const newId = "S-" + Date.now();
    paneSetter(prev => [
      ...prev,
      { id: newId, type: "summary", title: "New Summary", expanded: false }
    ]);
  };

  const addTask = (paneSetter) => {
    const newId = "T-" + Date.now();
    paneSetter(prev => [
      ...prev,
      { id: newId, type: "task", title: "New Task", status: "Not Started", assigned: null, notes: [] }
    ]);
  };

  /* ---------------------------------------------------------------
     RENDER A SINGLE PANE
     --------------------------------------------------------------- */
  const renderPane = (paneKey, items, filter, setFilter, paneSetter, title) => {
    const summaries = items.filter(i => i.type === "summary");
    const tasks = items.filter(i => i.type === "task");
    const filteredTasks = applyFilter(tasks, filter);

    const isFullscreen = fullscreen === paneKey;

    return (
      <div className={`pane ${isFullscreen ? "fullscreen" : ""} ${fullscreen && fullscreen !== paneKey ? "hidden" : ""}`}>

        {/* Header + fullscreen button */}
        <div className="pane-header">
          <h2>{title}</h2>
          <button
            className="fullscreen-btn"
            onClick={() => toggleFullscreen(paneKey)}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>

        {/* Filters */}
        <div className="dual-filter-bar">
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

        {/* Scroll Content */}
        <div className="pane-scroll">

          {/* Summaries */}
          {summaries.map(s => (
            <div key={s.id} className="summary-block">
              <div
                className="summary-row"
                onClick={() =>
                  paneSetter(prev =>
                    prev.map(i =>
                      i.id === s.id ? { ...i, expanded: !i.expanded } : i
                    )
                  )
                }
              >
                <span className="summary-dot" />
                <span className="task-title">{s.title}</span>
                <span className="summary-arrow">{s.expanded ? "▼" : "►"}</span>
              </div>

              {s.expanded && (
                <div className="summary-expanded-placeholder" />
              )}
            </div>
          ))}

          {/* Tasks */}
          {filteredTasks.map(t => (
            <div key={t.id} className="task-item">
              <div className="task-left">
                <span className={`status-dot ${t.status.replace(/ /g, "-")}`} />
                <span className="task-title">{t.title}</span>
                {t.assigned && (
                  <span style={{ marginLeft: 6, fontStyle: "italic", color: "#555" }}>
                    — {t.assigned}
                  </span>
                )}
              </div>
              <button
                className="assign-btn"
                onClick={() => startAssign(paneSetter, t.id)}
              >
                Assign
              </button>
            </div>
          ))}

        </div>

        {/* Bottom Add Row */}
        <div className="bottom-action-row">
          <button onClick={() => addSummary(paneSetter)}>+ Summary</button>
          <button onClick={() => addTask(paneSetter)}>+ Task</button>
        </div>

      </div>
    );
  };

  /* ---------------------------------------------------------------
     MAIN RETURN
     --------------------------------------------------------------- */
  return (
    <div className="dual-wrapper">

      <div className="dual-header">
        <h1>PreProject – Dual Workspace</h1>
        <p>Management + Development Streams</p>
      </div>

      <div className="dual-scroll-area">

        <div className="dual-pane-container">
          {renderPane("mgmt", mgmtItems, mgmtFilter, setMgmtFilter, setMgmtItems, "Management Workspace")}
          {renderPane("dev", devItems, devFilter, setDevFilter, setDevItems, "Development Workspace")}
        </div>
      </div>

      {showAssign && (
        <PersonnelOverlay
          onSelect={applyAssign}
          onClose={() => setShowAssign(false)}
        />
      )}

    </div>
  );
}
