/* ======================================================================
   METRA – PreProjectDual.jsx
   v5 Baseline (Assigned Person Hidden in Row)
   ----------------------------------------------------------------------
   ✔ Task rows no longer show assigned person
   ✔ Assign button opens Personnel Overlay
   ✔ Popup shows full assigned person (clickable)
   ✔ Scrolling + fullscreen + sticky all preserved
   ====================================================================== */

import React, { useState } from "react";
import TaskPopup from "./TaskPopup.jsx";
import PersonnelDetail from "./PersonnelDetail.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import "../Styles/PreProjectDual.css";

export default function PreProjectDual() {

  /* ===========================================
     POPUP + PERSON STATES
     =========================================== */
  const [popupTask, setPopupTask] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);
  const [assignTargetTask, setAssignTargetTask] = useState(null);

  const [leftFull, setLeftFull] = useState(false);
  const [rightFull, setRightFull] = useState(false);

  /* ===========================================
     REAL TASK DATA
     =========================================== */
  const [mgmtSummaries, setMgmtSummaries] = useState([
    { id: "mg-1", title: "Management Summary", expanded: false, tasks: [] },
    { id: "mg-2", title: "New Summary", expanded: false, tasks: [] },

    { id: "mg-3", title: "Define Governance Approach", status: "In Progress", person: "Alice Robertson", isTask: true },
    { id: "mg-4", title: "Identify Stakeholders", status: "Not Started", person: "", isTask: true },
    { id: "mg-5", title: "New task added", status: "Not Started", person: "", isTask: true },
    { id: "mg-6", title: "New Task", status: "Not Started", person: "", isTask: true }
  ]);

  const [devSummaries, setDevSummaries] = useState([
    { id: "dv-1", title: "Development Summary", expanded: false, tasks: [] },
    { id: "dv-2", title: "New Summary", expanded: false, tasks: [] },

    { id: "dv-3", title: "Draft Requirements", status: "Not Started", person: "", isTask: true },
    { id: "dv-4", title: "Initial Technical Assessment", status: "Not Started", person: "", isTask: true },
    { id: "dv-5", title: "New Task", status: "Not Started", person: "", isTask: true }
  ]);

  /* ===========================================
     SUMMARY EXPAND/COLLAPSE
     =========================================== */
  const toggleSummary = (pane, id) => {
    const updater = (arr) =>
      arr.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s);

    if (pane === "mgmt") setMgmtSummaries(prev => updater(prev));
    else setDevSummaries(prev => updater(prev));
  };

  /* ===========================================
     OPEN POPUP
     =========================================== */
  const openPopup = (task) => {
    if (!task.isTask) return;
    setPopupTask(task);
  };

  const closePopup = () => setPopupTask(null);

  /* ===========================================
     ASSIGN PERSONNEL
     =========================================== */
  const beginAssign = (task) => {
    setAssignTargetTask(task);
  };

  const closeAssign = () => setAssignTargetTask(null);

  const assignPerson = (taskId, personName) => {
    const updateTask = (arr) =>
      arr.map(t =>
        t.id === taskId ? { ...t, person: personName } : t
      );

    setMgmtSummaries(prev => updateTask(prev));
    setDevSummaries(prev => updateTask(prev));
    closeAssign();
  };

  /* ===========================================
     PERSON DETAIL POPUP
     =========================================== */
  const openDetail = (name) => setPersonDetail(name);
  const closeDetail = () => setPersonDetail(null);

  /* ===========================================
     RENDER ROW (NO PERSON SHOWN)
     =========================================== */
  const renderRow = (item, pane) => {

    if (item.isTask) {
      return (
        <div
          key={item.id}
          className="task-item"
          onClick={() => openPopup(item)}
        >
          <div className="task-left">
            <div className={`status-dot ${item.status.replace(" ", "-")}`}></div>
            <div>{item.title}</div>
          </div>

          {/* Assign button only */}
          <button
            className="assign-btn"
            onClick={(e) => {
              e.stopPropagation();
              beginAssign(item);
            }}
          >
            Assign
          </button>
        </div>
      );
    }

    return (
      <div key={item.id} className="summary-block">
        <div
          className="summary-row"
          onClick={() => toggleSummary(pane, item.id)}
        >
          <div className="summary-dot"></div>
          {item.title}
          <div className="summary-arrow">
            {item.expanded ? "▼" : "▶"}
          </div>
        </div>

        {item.expanded && (
          <div className="summary-expanded-placeholder">
            <em>No tasks in this summary yet…</em>
          </div>
        )}
      </div>
    );
  };

  /* ===========================================
     MAIN RENDER
     =========================================== */
  return (
    <div className="preproject-wrapper">

      {/* HEADER */}
      <div className="dual-header">
        <h1>Dual Workspace</h1>
        <p>Baseline Version (v5 Stable)</p>
      </div>

      <div className="dual-scroll-area">
        <div className="dual-pane-container">

          {/* LEFT PANE */}
          <div className={`pane ${leftFull ? "fullscreen" : ""} ${rightFull ? "hidden" : ""}`}>

            <div className="pane-header">
              <strong>Management Workspace</strong>
              <button className="fullscreen-btn" onClick={() => setLeftFull(!leftFull)}>
                {leftFull ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>

            <div className="dual-filter-bar">
              <button className="filter-active">All</button>
              <button className="filter-btn">Flagged</button>
              <button className="filter-btn">Not Started</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Completed</button>
              <button className="filter-btn">On Hold</button>
            </div>

            <div className="pane-scroll">
              {mgmtSummaries.map(item => renderRow(item, "mgmt"))}
            </div>

            <div className="bottom-action-row">
              <button>Add Summary</button>
              <button>Add Task</button>
            </div>
          </div>

          {/* RIGHT PANE */}
          <div className={`pane ${rightFull ? "fullscreen" : ""} ${leftFull ? "hidden" : ""}`}>

            <div className="pane-header">
              <strong>Development Workspace</strong>
              <button className="fullscreen-btn" onClick={() => setRightFull(!rightFull)}>
                {rightFull ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>

            <div className="dual-filter-bar">
              <button className="filter-active">All</button>
              <button className="filter-btn">Flagged</button>
              <button className="filter-btn">Not Started</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Completed</button>
              <button className="filter-btn">On Hold</button>
            </div>

            <div className="pane-scroll">
              {devSummaries.map(item => renderRow(item, "dev"))}
            </div>

            <div className="bottom-action-row">
              <button>Add Summary</button>
              <button>Add Task</button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUPS */}
      {popupTask && (
        <TaskPopup
          task={popupTask}
          onClose={closePopup}
          onOpenPerson={openDetail}
        />
      )}

      {personDetail && (
        <PersonnelDetail
          personName={personDetail}
          onClose={closeDetail}
        />
      )}

      {assignTargetTask && (
        <PersonnelOverlay
          onSelect={(name) => assignPerson(assignTargetTask.id, name)}
          onClose={closeAssign}
        />
      )}

    </div>
  );
}
