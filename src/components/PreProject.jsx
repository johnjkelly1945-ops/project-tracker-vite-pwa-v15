/* ======================================================================
   METRA – PreProject.jsx
   v7 A4 – Correct Card Layout (Status Dot + Title + Flag)
   ----------------------------------------------------------------------
   ✔ Restores baseline card layout (.pp-task)
   ✔ Status dot on left
   ✔ Title in centre-left
   ✔ Red flag on right if flagged
   ✔ Whole card clickable (opens popup)
   ✔ No person name and no Assign button in taskline
   ✔ Popup logic, CC logic, toast logic unchanged
   ====================================================================== */

import React, { useState, useEffect } from "react";

import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "" },
    { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "" }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskForPopup, setSelectedTaskForPopup] = useState(null);

  const openAddItem = () => setShowAddItem(true);
  const closeAddItem = () => setShowAddItem(false);

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

  const openPersonnel = (taskId) => {
    setSelectedTaskId(taskId);
    setShowPersonnel(true);
  };

  const closePersonnel = () => {
    setShowPersonnel(false);
  };

  const handleSelectPerson = (name) => {
    if (!selectedTaskId) return;

    const updated = tasks.map((t) =>
      t.id === selectedTaskId
        ? { ...t, person: name, status: "In Progress" }
        : t
    );

    setTasks(updated);
    closePersonnel();

    const updatedTask = updated.find(t => t.id === selectedTaskId);

    setTimeout(() => {
      setSelectedTaskForPopup(updatedTask);
    }, 0);
  };

  const handleOpenTaskPopup = (task) => {
    setSelectedTaskForPopup(task);
  };

  const handleCloseTaskPopup = () => {
    setSelectedTaskForPopup(null);
  };

  const updateTask = (id, fields) => {

    if (fields.changePerson) {
      setSelectedTaskForPopup(null);
      setSelectedTaskId(id);
      setShowPersonnel(true);
      return;
    }

    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...fields } : t
    );

    setTasks(updated);

    if (!fields.delete) {
      const updatedTask = updated.find(t => t.id === id);
      setSelectedTaskForPopup(updatedTask);
    }
  };

  /* ----- STATUS DOT LOGIC ----- */
  const getStatusClass = (task) => {
    if (task.status === "Completed") return "status-green";
    if (task.person && task.person.trim() !== "") return "status-amber";
    return "status-grey";
  };

  return (
    <div className="preproject-pane">

      <div className="preproject-header">
        <h2 className="pp-title">Pre-Project Workspace</h2>
        <button className="pp-add-btn" onClick={openAddItem}>+ Add Task</button>
      </div>

      <div className="pane-content">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="pp-task"
            onClick={() => handleOpenTaskPopup(task)}
          >

            {/* LEFT: Status Dot */}
            <div className="pp-left">
              <div className={`pp-status-dot ${getStatusClass(task)}`}></div>
            </div>

            {/* CENTRE: Title */}
            <div className="pp-center">
              {task.title}
            </div>

            {/* RIGHT: Red Flag (if any) */}
            <div className="pp-right">
              {task.flag === "red" && (
                <span className="pp-flag-dot">🚩</span>
              )}
            </div>

          </div>
        ))}

      </div>

      {/* Popups */}
      {showAddItem && (
        <AddItemPopup onAdd={handleAddTask} onClose={closeAddItem} />
      )}

      {showPersonnel && (
        <PersonnelOverlay onSelect={handleSelectPerson} onClose={closePersonnel} />
      )}

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
