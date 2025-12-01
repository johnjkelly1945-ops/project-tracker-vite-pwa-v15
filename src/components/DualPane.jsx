/* ======================================================================
   METRA – DualPane.jsx
   v8.0 – Centralised Task Ownership (Architecture B)
   ----------------------------------------------------------------------
   ✔ DualPane owns BOTH mgmtTasks and devTasks
   ✔ PreProject becomes a stateless viewer
   ✔ Unified Person Assignment
   ✔ Unified TaskPopup routing
   ✔ Correct Change Person behaviour in BOTH panes
   ✔ Full stability for Repository & Governance integration
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";
import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ====================================================================
     FILTER STATES
     ==================================================================== */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    if (pane === "dev") setDevFilter(id);
  };

  /* ====================================================================
     MASTER TASK LISTS (DualPane owns everything)
     ==================================================================== */

  // MANAGEMENT TASKS
  const [mgmtTasks, setMgmtTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "" },
      { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "" },
      { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(mgmtTasks));
  }, [mgmtTasks]);


  // DEVELOPMENT TASKS
  const [devTasks, setDevTasks] = useState(() => {
    const saved = localStorage.getItem("devtasks_v1");
    return saved ? JSON.parse(saved) : [
      { id: 1001, title: "Review Existing Architecture", status: "Not Started", person: "", flag: "" },
      { id: 1002, title: "Identify Integration Points", status: "In Progress", person: "Demo Dev", flag: "" },
      { id: 1003, title: "Prototype UI Layout", status: "Not Started", person: "", flag: "" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("devtasks_v1", JSON.stringify(devTasks));
  }, [devTasks]);


  /* ====================================================================
     POPUP STATE
     ==================================================================== */
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  const openTaskPopup = (task, pane) => {
    setSelectedTask(task);
    setSelectedPane(pane);
  };

  const closeTaskPopup = () => {
    setSelectedTask(null);
    setSelectedPane(null);
  };


  /* ====================================================================
     PERSONNEL OVERLAY – UNIFIED
     ==================================================================== */
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [pendingTaskID, setPendingTaskID] = useState(null);
  const [pendingPane, setPendingPane] = useState(null);

  const requestAssign = (taskID, pane) => {
    setPendingTaskID(taskID);
    setPendingPane(pane);
    setShowPersonnel(true);
  };

  const handlePersonSelected = (name) => {

    let updated = [];

    if (pendingPane === "mgmt") {
      updated = mgmtTasks.map(t =>
        t.id === pendingTaskID
          ? { ...t, person: name, status: "In Progress" }
          : t
      );
      setMgmtTasks(updated);
      const fresh = updated.find(t => t.id === pendingTaskID);
      setSelectedTask(fresh);
      setSelectedPane("mgmt");
    }

    if (pendingPane === "dev") {
      updated = devTasks.map(t =>
        t.id === pendingTaskID
          ? { ...t, person: name, status: "In Progress" }
          : t
      );
      setDevTasks(updated);
      const fresh = updated.find(t => t.id === pendingTaskID);
      setSelectedTask(fresh);
      setSelectedPane("dev");
    }

    setShowPersonnel(false);
    setPendingTaskID(null);
    setPendingPane(null);
  };


  /* ====================================================================
     UPDATE TASK (from TaskPopup)
     ==================================================================== */
  const updateTask = (fields) => {
    const id = selectedTask.id;
    const pane = fields.pane || selectedPane;

    // CHANGE PERSON → open PersonnelOverlay
    if (fields.changePerson) {
      requestAssign(id, pane);
      return;
    }

    // NORMAL UPDATES
    if (pane === "mgmt") {
      const updated = mgmtTasks.map(t =>
        t.id === id ? { ...t, ...fields } : t
      );
      setMgmtTasks(updated);

      if (!fields.delete) {
        setSelectedTask(updated.find(t => t.id === id));
      } else {
        closeTaskPopup();
      }
    }

    if (pane === "dev") {
      const updated = devTasks.map(t =>
        t.id === id ? { ...t, ...fields } : t
      );
      setDevTasks(updated);

      if (!fields.delete) {
        setSelectedTask(updated.find(t => t.id === id));
      } else {
        closeTaskPopup();
      }
    }
  };


  /* ====================================================================
     RENDER
     ==================================================================== */
  return (
    <div className="dual-pane-workspace">

      {/* LEFT PANE */}
      <div className="pane mgmt-pane">
        <div className="pane-header">
          <h2>Management Tasks</h2>
        </div>

        <FilterBar
          mode="mgmt"
          activeFilter={mgmtFilter}
          onChange={handleFilterChange}
        />

        <div className="pane-content">
          <PreProject
            filter={mgmtFilter}
            tasks={mgmtTasks}
            openPopup={(task) => openTaskPopup(task, "mgmt")}
            onRequestAssign={(id) => requestAssign(id, "mgmt")}
          />
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="pane dev-pane">
        <div className="pane-header">
          <h2>Development Tasks</h2>
        </div>

        <FilterBar
          mode="dev"
          activeFilter={devFilter}
          onChange={handleFilterChange}
        />

        <div className="pane-content">
          {devTasks.map(task => (
            <div
              key={task.id}
              className="pp-task-item"
              onClick={() => {
                if (!task.person || task.person.trim() === "") {
                  requestAssign(task.id, "dev");
                } else {
                  openTaskPopup(task, "dev");
                }
              }}
            >
              <div
                className={`pp-status-dot ${
                  task.status === "Completed"
                    ? "status-green"
                    : task.person ? "status-amber" : "status-grey"
                }`}
              ></div>

              <div className="pp-task-title">{task.title}</div>

              {task.flag === "red" && <div className="pp-flag-dot">🚩</div>}
            </div>
          ))}
        </div>

        <div className="pane-footer">
          <button className="footer-text-btn">+ Add Summary</button>
          <button
            className="footer-text-btn"
            onClick={() => setShowDevAddPopup(true)}
          >
            + Add Task
          </button>
        </div>
      </div>


      {/* POPUPS IN GLOBAL PORTAL */}
      {showPersonnel &&
        createPortal(
          <PersonnelOverlay
            onSelect={handlePersonSelected}
            onClose={() => setShowPersonnel(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
            onUpdate={updateTask}
          />,
          document.getElementById("metra-popups")
        )}

    </div>
  );
}
