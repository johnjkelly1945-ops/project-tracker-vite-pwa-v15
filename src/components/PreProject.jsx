/* ======================================================================
   METRA – PreProject.jsx
   v7 Rebuild (A2) – Based on v4.6B.13 logic, adapted for DualPane v6.3
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Restore full PreProject functionality
   ✔ Maintain v4.6B.13 behaviour (the last verified working version)
   ✔ Adapt structure for new DualPane v6.3 containers
   ✔ Restore:
       - Task list
       - Add Task popup
       - Personnel overlay + detail
       - Task popup (TaskWorkingWindow)
       - Status + flags
       - Footer action bar
       - Governance button strip
       - LocalStorage persistence
       - Click-to-open logic
   ====================================================================== */

import React, { useState, useEffect } from "react";

import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import PersonnelDetail from "./PersonnelDetail.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  /* ============================================================
     DEFAULT TASKS (only used on first load)
     ============================================================ */
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "" }
  ];

  /* ============================================================
     LOCAL STORAGE LOAD
     ============================================================ */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);


  /* ============================================================
     POPUP STATES
     ============================================================ */
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTaskForPopup, setSelectedTaskForPopup] = useState(null);


  /* ============================================================
     EVENT HANDLERS
     ============================================================ */
  const openAddItem = () => setShowAddItem(true);
  const closeAddItem = () => setShowAddItem(false);

  const openPersonnel = (taskId) => {
    setSelectedTaskId(taskId);
    setShowPersonnel(true);
  };

  const closePersonnel = () => {
    setShowPersonnel(false);
    setSelectedPerson(null);
    setSelectedTaskId(null);
  };

  const handleAddTask = (taskObj) => {
    const newTask = {
      id: Date.now(),
      title: taskObj.title,
      status: "Not Started",
      person: "",
      flag: ""
    };
    setTasks([...tasks, newTask]);
  };

  const handleSelectPerson = (name) => {
    if (!selectedTaskId) return;

    const updated = tasks.map((t) =>
      t.id === selectedTaskId ? { ...t, person: name } : t
    );
    setTasks(updated);
    closePersonnel();
  };

  const handleOpenTaskPopup = (task) => {
    setSelectedTaskForPopup(task);
  };

  const handleCloseTaskPopup = () => {
    setSelectedTaskForPopup(null);
  };

  const updateTask = (id, fields) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...fields } : t
    );
    setTasks(updated);
  };


  /* ============================================================
     RENDER
     – "pane-content" is the correct v6.3 DualPane scroll container
     – All elements now sit safely inside scroll boundaries
     ============================================================ */
  return (
    <div className="preproject-pane">

      {/* --------------------------------------------------------
          HEADER (sits under FilterBar – already sticky in layout)
         -------------------------------------------------------- */}
      <div className="preproject-header">
        <h2 className="pp-title">Pre-Project Workspace</h2>
        <button className="pp-add-btn" onClick={openAddItem}>+ Add Task</button>
      </div>


      {/* --------------------------------------------------------
          TASK LIST (inside scrollable container)
         -------------------------------------------------------- */}
      <div className="pane-content">

        {tasks.map((task) => (
          <div key={task.id} className="pp-task-item">

            {/* LEFT COLUMN – Title (opens TaskPopup) */}
            <div
              className="pp-task-title"
              onClick={() => handleOpenTaskPopup(task)}
            >
              {task.title}
            </div>

            {/* MIDDLE – Assigned Person (opens PersonnelDetail) */}
            <div
              className="pp-task-person"
              onClick={() => openPersonnel(task.id)}
            >
              {task.person || "Assign Person"}
            </div>

            {/* RIGHT – Status dot */}
            <div className={`pp-status-dot status-${task.status.replace(" ", "").toLowerCase()}`}></div>

          </div>
        ))}

      </div>


      {/* --------------------------------------------------------
          FOOTER ACTION BAR (sticky)
         -------------------------------------------------------- */}
      <div className="preproject-footer">
        <div className="footer-buttons">
          <button>CC</button>
          <button>QC</button>
          <button>Risk</button>
          <button>Issue</button>
          <button>Escalate</button>
          <button>Email</button>
          <button>Docs</button>
          <button>Template</button>
        </div>
      </div>


      {/* --------------------------------------------------------
          ADD TASK POPUP
         -------------------------------------------------------- */}
      {showAddItem && (
        <AddItemPopup
          onAdd={handleAddTask}
          onClose={closeAddItem}
        />
      )}

      {/* --------------------------------------------------------
          PERSONNEL OVERLAY
         -------------------------------------------------------- */}
      {showPersonnel && (
        <PersonnelOverlay
          onSelect={handleSelectPerson}
          onClose={closePersonnel}
        />
      )}

      {/* --------------------------------------------------------
          PERSONNEL DETAIL (when clicking a name inside popup)
         -------------------------------------------------------- */}
      {selectedPerson && (
        <PersonnelDetail
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      {/* --------------------------------------------------------
          TASK POPUP (TaskWorkingWindow)
         -------------------------------------------------------- */}
      {selectedTaskForPopup && (
        <TaskPopup
          task={selectedTaskForPopup}
          onClose={handleCloseTaskPopup}
          onUpdate={(fields) => updateTask(selectedTaskForPopup.id, fields)}
        />
      )}
    </div>
  );
}
