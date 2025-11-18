/* ======================================================================
   METRA – PreProjectDual.jsx (v5.4 – Scroll + Sticky FIXED)
   ----------------------------------------------------------------------
   • Independent per-pane scrolling (Safari + Chrome)
   • Sticky header / sticky filter bar / sticky bottom bar
   • Fullscreen mode stable
   • Fully synchronised with matching CSS v5.4
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
     STORAGE
     --------------------------------------------------------------- */
  const STORAGE_MGMT = "tasks_mgmt_v1";
  const STORAGE_DEV = "tasks_dev_v1";

  const loadMgmt = () => {
    const s = localStorage.getItem(STORAGE_MGMT);
    if (!s) return defaultMgmt.map(normalise);
    try { return JSON.parse(s).map(normalise); } catch { return defaultMgmt.map(normalise); }
  };

  const loadDev = () => {
    const s = localStorage.getItem(STORAGE_DEV);
    if (!s) return defaultDev.map(normalise);
    try { return JSON.parse(s).map(normalise); } catch { return defaultDev.map(normalise); }
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
     FULLSCREEN
     --------------------------------------------------------------- */
  const [fullscreen, setFullscreen] = useState(null);

  const toggleFullscreen = (pane) =>
    setFullscreen(prev => (prev === pane ? null : pane));

  /* ---------------------------------------------------------------
     ASSIGN PERSON
     --------------------------------------------------------------- */
  const [assignTarget, setAssignTarget] = useState(null);
  const [showAssign, setShowAssign] = useState(false);

  const startAssign = (setter, id) => {
    setAssignTarget({ setter, id });
    setShowAssign(true);
  };

  const applyAssign = (personObj) => {
    if (!assignTarget) return;
    const { setter, id } = assignTarget;

    setter(prev =>
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
     ADD SUMMARY / TASK
     --------------------------------------------------------------- */
  const addSummary = (setter) => {
    setter(prev => [
      ...prev,
      { id: "S-" + Date.now(), type: "summary", title: "New Summary", expanded: false }
    ]);
  };

  const addTask = (setter) => {
    setter(prev => [
      ...prev,
      { id: "T-" + Date.now(), type: "task", title: "New Task", status: "Not Started", assigned: null, notes: [] }
    ]);
  };

  /* ---------------------------------------------------------------
     RENDER A SINGLE PANE
     --------------------------------------------------------------- */
  const renderPane = (paneKey, items, filter, setFilter, setter, title) => {
    const isFullscreen = fullscreen === paneKey;

    const summaries = items.filter(i => i.type === "summary");
    const tasks = items.filter(i => i.type === "task");
    const filtered = applyFilter(tasks, filter);

    return (
      <div
        className={`pane ${isFullscreen ? "fullscreen" : ""} ${
          fullscreen && fullscreen !== paneKey ? "hidden" : ""
        }`}
      >
        {/* HEADER */}
        <div className="pane-header">
          <h2>{title}</h2>
          <button className="fullscreen-btn" onClick={() => toggleFullscreen(paneKey)}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>

        {/* FILTER BAR */}
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

        {/* MAIN SCROLL AREA */}
        <div className="pane-scroll">

          {/* Summaries */}
          {summaries.map(s => (
            <div key={s.id} className="summary-block">
              <div
                className="summary-row"
                onClick={() =>
                  setter(prev =>
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

              {s.expanded && <div className="summary-expanded-placeholder" />}
            </div>
          ))}

          {/* Tasks */}
          {filtered.map(t => (
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
              <button className="assign-btn" onClick={() => startAssign(setter, t.id)}>
                Assign
              </button>
            </div>
          ))}

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bottom-action-row">
          <button onClick={() => addSummary(setter)}>+ Summary</button>
          <button onClick={() => addTask(setter)}>+ Task</button>
        </div>

      </div>
    );
  };

  /* ---------------------------------------------------------------
     MAIN RETURN
     --------------------------------------------------------------- */
  return (
    <div className="preproject-wrapper">
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
    </div>
  );
}
