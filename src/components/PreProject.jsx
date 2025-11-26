/* ======================================================================
   METRA – PreProject.jsx
   Version: v6.2 – Core Reintegration (Task Logic + Personnel + Status)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Restores full PreProject task behaviour
   ✔ Click task → opens TaskPopup
   ✔ Personnel assignment using PersonnelOverlay (string-only)
   ✔ Status workflow persisted to localStorage
   ✔ Default tasks injected only if storage empty
   ✔ Clean, dependency-safe structure with no history panel
   ====================================================================== */

import React, { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import PreProjectFooter from "./PreProjectFooter.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  /* -------------------------------------------------------------------
     1. DEFAULT TASKS (injected only if storage empty)
     ------------------------------------------------------------------- */
  const defaultTasks = [
    { id: "t1", title: "Prepare Scope Summary", status: "Not Started", person: "" },
    { id: "t2", title: "Initial Risk Scan", status: "Not Started", person: "" },
    { id: "t3", title: "Stakeholder Mapping", status: "Not Started", person: "" }
  ];

  /* -------------------------------------------------------------------
     2. LOAD tasks from localStorage
     ------------------------------------------------------------------- */
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v6_2");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  /* -------------------------------------------------------------------
     3. SAVE tasks to storage whenever they change
     ------------------------------------------------------------------- */
  useEffect(() => {
    localStorage.setItem("tasks_v6_2", JSON.stringify(tasks));
  }, [tasks]);

  /* -------------------------------------------------------------------
     4. Popup + Personnel Overlay controls
     ------------------------------------------------------------------- */
  const [activeTask, setActiveTask] = useState(null); // full task object
  const [showPersonnel, setShowPersonnel] = useState(false);

  /* -------------------------------------------------------------------
     5. Update a task by id
     ------------------------------------------------------------------- */
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  /* -------------------------------------------------------------------
     6. Open popup from clicking the task row
     ------------------------------------------------------------------- */
  const openTask = (task) => {
    setActiveTask(task);
  };

  const closeTask = () => {
    setActiveTask(null);
  };

  /* -------------------------------------------------------------------
     7. Personnel assignment
     ------------------------------------------------------------------- */
  const assignPerson = (name) => {
    if (!activeTask) return;
    updateTask(activeTask.id, { person: name });
    setShowPersonnel(false);
  };

  /* -------------------------------------------------------------------
     8. Status updates from footer
     ------------------------------------------------------------------- */
  const markComplete = () => {
    if (!activeTask) return;
    updateTask(activeTask.id, { status: "Completed" });
    setActiveTask(null);
  };

  const deleteTask = () => {
    if (!activeTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== activeTask.id));
    setActiveTask(null);
  };

  /* -------------------------------------------------------------------
     9. UI – TASK LIST
     ------------------------------------------------------------------- */
  return (
    <div className="preproject-wrapper">

      {/* ================================================================
           HEADER BAR
         ================================================================ */}
      <div className="pp-header">
        <h2>Pre-Project Workspace</h2>
      </div>

      {/* ================================================================
           TASK LIST
         ================================================================ */}
      <div className="pp-tasklist">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="pp-task-row"
            onClick={() => openTask(task)}
          >
            <div className="pp-task-title">{task.title}</div>

            {task.person && (
              <div className="pp-task-person">{task.person}</div>
            )}

            <div className={`pp-task-status ${task.status.replace(/\s+/g, "-").toLowerCase()}`}>
              {task.status}
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================
           FOOTER – Static row (buttons inside popup)
         ================================================================ */}
      <PreProjectFooter />

      {/* ================================================================
           POPUP – Task Working Window
         ================================================================ */}
      {activeTask && (
        <TaskPopup
          task={activeTask}
          onClose={closeTask}
          onAssignPerson={() => setShowPersonnel(true)}
          onMarkComplete={markComplete}
          onDelete={deleteTask}
        />
      )}

      {/* ================================================================
           PERSONNEL OVERLAY
         ================================================================ */}
      {showPersonnel && (
        <PersonnelOverlay
          onSelect={assignPerson}
          onClose={() => setShowPersonnel(false)}
        />
      )}
    </div>
  );
}
