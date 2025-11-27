/* ======================================================================
   METRA – PreProject.jsx
   v7 A2 – Adapted for DualPane v6.3 (CLEANED footer)
   ====================================================================== */

import React, { useState, useEffect } from "react";

import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import PersonnelDetail from "./PersonnelDetail.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  /* ============================================================
     DEFAULT TASKS
     ============================================================ */
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "" }
  ];

  /* ============================================================
     LOCAL STORAGE
     ============================================================ */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  /* POPUP STATES */
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedTaskForPopup, setSelectedTaskForPopup] = useState(null);

  /* HANDLERS */
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
     ============================================================ */
  return (
    <div className="preproject-pane">

      {/* HEADER */}
      <div className="preproject-header">
        <h2 className="pp-title">Pre-Project Workspace</h2>
        <button className="pp-add-btn" onClick={openAddItem}>+ Add Task</button>
      </div>

      {/* TASK LIST */}
      <div className="pane-content">
        {tasks.map((task) => (
          <div key={task.id} className="pp-task-item">

            <div
              className="pp-task-title"
              onClick={() => handleOpenTaskPopup(task)}
            >
              {task.title}
            </div>

            <div
              className="pp-task-person"
              onClick={() => openPersonnel(task.id)}
            >
              {task.person || "Assign Person"}
            </div>

            <div className={`pp-status-dot status-${task.status.replace(" ", "").toLowerCase()}`}></div>
          </div>
        ))}
      </div>


      {/* ADD TASK */}
      {showAddItem && (
        <AddItemPopup
          onAdd={handleAddTask}
          onClose={closeAddItem}
        />
      )}

      {/* PERSONNEL OVERLAY */}
      {showPersonnel && (
        <PersonnelOverlay
          onSelect={handleSelectPerson}
          onClose={closePersonnel}
        />
      )}

      {/* PERSONNEL DETAIL */}
      {selectedPerson && (
        <PersonnelDetail
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      {/* TASK POPUP */}
      {selectedTaskForPopup && (
        <TaskPopup
          task={selectedTaskForPopup}
          onClose={handleCloseTaskPopup}
          onUpdate={(fields) => updateTask(
            selectedTaskForPopup.id,
            fields.delete ? {} : fields
          )}
        />
      )}

    </div>
  );
}
