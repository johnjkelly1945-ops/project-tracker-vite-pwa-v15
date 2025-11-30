/* ======================================================================
   METRA – DualPane.jsx
   v7 A18 – Right Pane Add Task FIXED (Matches Left Pane Behaviour)
   ====================================================================== */

import React, { useState, useEffect, useRef } from "react";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";
import AddItemPopup from "./AddItemPopup.jsx";   // ★ use same as left pane

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ====================================================================
     FILTER STATES
     ==================================================================== */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (mode, id) => {
    if (mode === "mgmt") setMgmtFilter(id);
    if (mode === "dev") setDevFilter(id);
  };

  /* ====================================================================
     DEVELOPMENT TASKS
     ==================================================================== */
  const defaultDevTasks = [
    { id: 1001, title: "Review Existing Architecture", status: "Not Started", person: "", flag: "" },
    { id: 1002, title: "Identify Integration Points", status: "In Progress", person: "Demo Dev", flag: "" },
    { id: 1003, title: "Prototype UI Layout", status: "Not Started", person: "", flag: "" }
  ];

  const [devTasks, setDevTasks] = useState(() => {
    const saved = localStorage.getItem("devtasks_v1");
    return saved ? JSON.parse(saved) : defaultDevTasks;
  });

  useEffect(() => {
    localStorage.setItem("devtasks_v1", JSON.stringify(devTasks));
  }, [devTasks]);

  const filterDevTasks = () => {
    switch (devFilter) {
      case "notstarted": return devTasks.filter(t => t.status === "Not Started" && !t.flag);
      case "inprogress": return devTasks.filter(t => t.status === "In Progress");
      case "completed": return devTasks.filter(t => t.status === "Completed");
      case "flagged": return devTasks.filter(t => t.flag === "red");
      case "open": return devTasks.filter(t => t.updatedForPM === true);
      default: return devTasks;
    }
  };

  /* ====================================================================
     TASK POPUP (shared)
     ==================================================================== */
  const [selectedTask, setSelectedTask] = useState(null);

  const openTaskPopup = (t) => setSelectedTask(t);
  const closeTaskPopup = () => setSelectedTask(null);

  const updateDevTask = (id, fields) => {
    if (fields.changePerson) return;

    const updated = devTasks.map(t =>
      t.id === id ? { ...t, ...fields } : t
    );

    setDevTasks(updated);

    if (!fields.delete) {
      setSelectedTask(updated.find(t => t.id === id));
    }
  };

  /* ====================================================================
     ADD TASK POPUPS (MGMT + DEV)
     ==================================================================== */

  /* Left pane (unchanged) */
  const preProjectRef = useRef(null);
  const handleMgmtAddTask = () => {
    if (preProjectRef.current?.openAddTaskPopup) {
      preProjectRef.current.openAddTaskPopup();
    }
  };

  /* Right pane (FIXED — use AddItemPopup) */
  const [showDevAddPopup, setShowDevAddPopup] = useState(false);

  const handleDevAddTask = (obj) => {
    const newTask = {
      id: Date.now(),
      title: obj.title,
      status: "Not Started",
      person: "",
      flag: ""
    };
    setDevTasks([...devTasks, newTask]);
    setShowDevAddPopup(false);
  };

  /* Summaries — placeholder */
  const handleAddSummary = () => {};

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
            ref={preProjectRef}
            filter={mgmtFilter}
            openPopup={openTaskPopup}
          />
        </div>

        <div className="pane-footer">
          <button className="footer-text-btn" onClick={handleAddSummary}>
            + Add Summary
          </button>
          <button className="footer-text-btn" onClick={handleMgmtAddTask}>
            + Add Task
          </button>
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
          {filterDevTasks().map(task => (
            <div
              key={task.id}
              className="pp-task-item"
              onClick={() => openTaskPopup(task)}
            >
              <div
                className={`pp-status-dot ${
                  task.status === "Completed"
                    ? "status-green"
                    : task.person
                    ? "status-amber"
                    : "status-grey"
                }`}
              ></div>

              <div className="pp-task-title">{task.title}</div>

              {task.flag === "red" && <div className="pp-flag-dot">🚩</div>}
            </div>
          ))}
        </div>

        <div className="pane-footer">
          <button className="footer-text-btn" onClick={handleAddSummary}>
            + Add Summary
          </button>
          <button
            className="footer-text-btn"
            onClick={() => setShowDevAddPopup(true)}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* GLOBAL POPUPS */}
      {showDevAddPopup && (
        <AddItemPopup
          onAdd={handleDevAddTask}
          onClose={() => setShowDevAddPopup(false)}
        />
      )}

      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={closeTaskPopup}
          onUpdate={(fields) =>
            updateDevTask(selectedTask.id, fields)
          }
        />
      )}
    </div>
  );
}
