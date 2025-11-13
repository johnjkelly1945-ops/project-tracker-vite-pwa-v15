/* ======================================================================
   METRA – PreProject.jsx
   Phase 4.6B.13 Step 8 – Editable Task Status
   ----------------------------------------------------------------------
   Adds:
   - onUpdateStatus handler for TaskPopup
   - Immediate task status persistence
   - Maintains multi-popup chain
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskPopup from "./TaskPopup";
import GovernancePopup from "./GovernancePopup";
import "../Styles/PreProject.css";

export default function PreProject() {
  /* Default tasks */
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started" },
  ];

  /* Load from storage */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v2");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v2");
    return saved || "All";
  });

  /* Step 6C assignment overlay */
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  /* Step 7 popup state */
  const [taskPopupTask, setTaskPopupTask] = useState(null);
  const [personPopupId, setPersonPopupId] = useState(null);
  const [governancePopupTask, setGovernancePopupTask] = useState(null);

  /* Persist storage */
  useEffect(() => {
    localStorage.setItem("tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v2", filter);
  }, [filter]);

  /* Filtered list */
  const filteredTasks = tasks.filter((t) =>
    filter === "All" ? true : t.status === filter
  );

  /* Handle assigning person (Step 6C) */
  const handleAssignPerson = (taskId) => {
    setSelectedTaskId(taskId);
    setOverlayOpen(true);
  };

  const applyPersonToTask = (personName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? { ...t, assigned: personName, status: "In Progress" }
          : t
      )
    );
    setOverlayOpen(false);
  };

  /* Step 7 – Open popups */
  const openTaskPopup = (task) => setTaskPopupTask(task);

  const findPersonIdByName = (name) => {
    try {
      const list = JSON.parse(localStorage.getItem("metra_personnel_store_v1"));
      const found = list.find((p) => p.name === name);
      return found ? found.id : null;
    } catch {
      return null;
    }
  };

  const openPersonnelPopup = (personName) => {
    const id = findPersonIdByName(personName);
    if (id) setPersonPopupId(id);
  };

  const openGovernancePopup = (task) => {
    setGovernancePopupTask(task);
  };

  /* Step 8 – Status update handler */
  const updateStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Clean Task Sheet (Step 8)</h1>

      {/* Filter Bar */}
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

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            onClick={() => openTaskPopup(task)}
          >
            <div className="task-left">
              <span
                className={`status-dot ${task.status.replace(/ /g, "-")}`}
              ></span>

              <span className="task-title">
                {task.title}
                {task.assigned && (
                  <span className="assigned-name"> — {task.assigned}</span>
                )}
              </span>
            </div>

            <div className="task-right">
              <button
                className="assign-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssignPerson(task.id);
                }}
              >
                Assign Person
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Step 6C – Personnel assignment overlay */}
      {overlayOpen && (
        <PersonnelOverlay
          onClose={() => setOverlayOpen(false)}
          onSelect={applyPersonToTask}
        />
      )}

      {/* Step 7 – Task popup */}
      {taskPopupTask && (
        <TaskPopup
          task={taskPopupTask}
          onClose={() => setTaskPopupTask(null)}
          onOpenPerson={openPersonnelPopup}
          onOpenGovernance={openGovernancePopup}
          onUpdateStatus={updateStatus}
        />
      )}

      {/* Step 7 – Personnel popup */}
      {personPopupId && (
        <PersonnelDetail
          personId={personPopupId}
          onClose={() => setPersonPopupId(null)}
          onOpenGovernance={(t) =>
            openGovernancePopup({ title: t.title })
          }
        />
      )}

      {/* Step 7 – Governance popup */}
      {governancePopupTask && (
        <GovernancePopup
          task={governancePopupTask}
          onClose={() => setGovernancePopupTask(null)}
        />
      )}
    </div>
  );
}
