/* ======================================================================
   METRA – PreProject.jsx
   v4.6B.14 – Assignment Reintegration
   ----------------------------------------------------------------------
   FEATURES:
   ✔ Taskline shows [Assign] until person chosen
   ✔ After assignment, taskline becomes clean (no button)
   ✔ Clicking [Assign] opens popup + personnel overlay immediately
   ✔ Selecting a person updates assignment + creates timeline entry
   ✔ Popup header shows Assigned: <Name>
   ✔ Timeline entries stored under task title
   ✔ Change Person button in popup continues workflow
   ✔ Status auto-updates to "In Progress" internally
   ✔ Background scroll locked during popup & overlay
   ====================================================================== */

import React, { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import "../Styles/PreProject.css";

export default function PreProject() {

  /* -------------------------------------------------------------------
     DEFAULTS
  ------------------------------------------------------------------- */
  const defaultTasks = [
    {
      id: 1,
      title: "Prepare Scope Summary",
      status: "Not Started",
      assigned: null,
      history: []
    },
    {
      id: 2,
      title: "Initial Risk Scan",
      status: "Not Started",
      assigned: null,
      history: []
    },
    {
      id: 3,
      title: "Stakeholder Mapping",
      status: "Not Started",
      assigned: null,
      history: []
    }
  ];

  /* -------------------------------------------------------------------
     LOAD / SAVE
  ------------------------------------------------------------------- */
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks_v3_assign");
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3_assign", JSON.stringify(tasks));
  }, [tasks]);

  /* -------------------------------------------------------------------
     POPUP + OVERLAY STATE
  ------------------------------------------------------------------- */
  const [popupVisible, setPopupVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  /* -------------------------------------------------------------------
     SCROLL LOCK
  ------------------------------------------------------------------- */
  const lockScroll = () => { document.body.style.overflow = "hidden"; };
  const unlockScroll = () => { document.body.style.overflow = ""; };

  /* -------------------------------------------------------------------
     OPEN POPUP (Used for both Assign + Click)
  ------------------------------------------------------------------- */
  const openPopup = (task) => {
    setActiveTask(task);
    setPopupVisible(true);
    lockScroll();
  };

  const closePopup = () => {
    setPopupVisible(false);
    setActiveTask(null);
    setOverlayVisible(false);
    unlockScroll();
  };

  /* -------------------------------------------------------------------
     USER CLICKS ASSIGN IN TASKLINE
  ------------------------------------------------------------------- */
  const handleAssignInTaskline = (task) => {
    openPopup(task);
    setOverlayVisible(true);    // open personnel overlay immediately
  };

  /* -------------------------------------------------------------------
     CHANGE PERSON (Popup button)
  ------------------------------------------------------------------- */
  const handleChangePerson = () => {
    setOverlayVisible(true);
  };

  /* -------------------------------------------------------------------
     PERSON SELECTED FROM OVERLAY
  ------------------------------------------------------------------- */
  const handlePersonSelected = (name) => {
    if (!activeTask) return;

    const timestamp = new Date().toLocaleString();

    const updatedTasks = tasks.map((t) => {
      if (t.id !== activeTask.id) return t;

      return {
        ...t,
        assigned: name,
        status: "In Progress",
        history: [
          ...t.history,
          `• Assigned to ${name} – ${timestamp}`
        ]
      };
    });

    setTasks(updatedTasks);

    // Update popup view
    const updatedTask = updatedTasks.find(t => t.id === activeTask.id);
    setActiveTask(updatedTask);

    // Close overlay, keep popup open
    setOverlayVisible(false);
  };

  /* -------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------- */
  return (
    <div className="preproject-container">

      {/* ================================================================
         POPUP
      ================================================================ */}
      <TaskPopup
        visible={popupVisible}
        task={activeTask}
        onClose={closePopup}
        onChangePerson={handleChangePerson}
      />

      {/* ================================================================
         PERSONNEL OVERLAY
      ================================================================ */}
      {overlayVisible && (
        <PersonnelOverlay
          onSelect={handlePersonSelected}
          onClose={() => setOverlayVisible(false)}
        />
      )}

      {/* ================================================================
         HEADER
      ================================================================ */}
      <div className="preproject-header">Pre-Project Workspace</div>

      {/* ================================================================
         TASK LIST
      ================================================================ */}
      <div className="preproject-tasklist">
        {tasks.map((task) => (
          <div key={task.id} className="preproject-taskline">

            <div className="task-title">{task.title}</div>

            {/* ASSIGN BUTTON (only before assignment) */}
            {!task.assigned && (
              <button
                className="assign-btn"
                onClick={() => handleAssignInTaskline(task)}
              >
                Assign
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
