/* =============================================================================
   METRA – PreProject.jsx
   v5.3 Integrated Build + Status Dot
   -----------------------------------------------------------------------------
   FEATURES:
   • Click task row → open popup
   • Assign button shows only if unassigned
   • After assignment → Assign button disappears
   • Status auto-sets to "In Progress"
   • Amber status dot before task title when active
   • Timeline entry added
   • Popup stays open
   • Overlay opens only when requested
   • Three-person list included
   ============================================================================= */

import React, { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import "../Styles/PreProject.css";

export default function PreProject() {

  /* ---------------------------------------------------------------------------
     PERSONNEL LIST (v5.3)
  --------------------------------------------------------------------------- */
  const people = [
    { id: "pers-alice", name: "Alice Robertson" },
    { id: "pers-bob", name: "Bob McKenzie" },
    { id: "pers-charlie", name: "Charlie Hayes" },
  ];

  /* ---------------------------------------------------------------------------
     DEFAULT TASKS (v5.3 model)
  --------------------------------------------------------------------------- */
  const defaultTasks = [
    {
      id: 1,
      title: "Prepare Scope Summary",
      assignedPerson: null,
      status: "Not Started",
      entries: [],
    },
    {
      id: 2,
      title: "Initial Risk Scan",
      assignedPerson: null,
      status: "Not Started",
      entries: [],
    },
    {
      id: 3,
      title: "Stakeholder Mapping",
      assignedPerson: null,
      status: "Not Started",
      entries: [],
    }
  ];

  /* ---------------------------------------------------------------------------
     LOAD / SAVE
  --------------------------------------------------------------------------- */
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks_v53");
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem("tasks_v53", JSON.stringify(tasks));
  }, [tasks]);

  /* ---------------------------------------------------------------------------
     POPUP + OVERLAY CONTROL
  --------------------------------------------------------------------------- */
  const [popupVisible, setPopupVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const lockScroll = () => { document.body.style.overflow = "hidden"; };
  const unlockScroll = () => { document.body.style.overflow = ""; };

  const openPopup = (task) => {
    setActiveTask(task);
    setPopupVisible(true);
    lockScroll();
  };

  const closePopup = () => {
    setPopupVisible(false);
    setActiveTask(null);
    unlockScroll();
  };

  const openOverlay = () => setOverlayVisible(true);
  const closeOverlay = () => setOverlayVisible(false);

  /* ---------------------------------------------------------------------------
     CLICK TASK → OPEN POPUP
  --------------------------------------------------------------------------- */
  const handleTaskClick = (task) => {
    openPopup(task);
  };

  /* ---------------------------------------------------------------------------
     PERSON SELECTED
  --------------------------------------------------------------------------- */
  const handlePersonSelected = (name) => {
    if (!activeTask) return;

    const timestamp = Date.now();

    const updatedTasks = tasks.map((t) => {
      if (t.id !== activeTask.id) return t;

      return {
        ...t,
        assignedPerson: name,
        status: "In Progress",
        entries: [
          ...t.entries,
          { text: `• Assigned to ${name}`, timestamp }
        ]
      };
    });

    setTasks(updatedTasks);

    // Update popup content immediately
    const updated = updatedTasks.find(t => t.id === activeTask.id);
    setActiveTask(updated);

    closeOverlay();   // popup remains visible
  };

  /* ---------------------------------------------------------------------------
     UPDATE TASK FROM POPUP (entries, status, etc.)
  --------------------------------------------------------------------------- */
  const updateTaskFromPopup = (updatedTask) => {
    const updatedTasks = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );

    setTasks(updatedTasks);

    // Sync popup content
    setActiveTask(updatedTask);
  };

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */
  return (
    <div className="preproject-container">

      {/* --------------------------- POPUP --------------------------- */}
      <TaskPopup
        visible={popupVisible}
        task={activeTask}
        onClose={closePopup}
        onRequestPersonChange={openOverlay}
        onUpdateTask={updateTaskFromPopup}
      />

      {/* ---------------------- PERSONNEL OVERLAY -------------------- */}
      <PersonnelOverlay
        visible={overlayVisible}
        people={people}
        onSelect={handlePersonSelected}
        onClose={closeOverlay}
      />

      {/* --------------------------- HEADER --------------------------- */}
      <div className="preproject-header">Pre-Project Workspace</div>

      {/* ---------------------- TASK LIST ---------------------------- */}
      <div className="preproject-tasklist">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="preproject-taskline"
            onClick={() => handleTaskClick(task)}
          >
            {/* STATUS DOT + TITLE */}
            <div className="task-title">
              {task.status === "In Progress" && (
                <span className="status-dot amber"></span>
              )}
              {task.title}
            </div>

            {/* ASSIGN BUTTON (shown only before assignment) */}
            {!task.assignedPerson && (
              <button
                className="assign-btn"
                onClick={(e) => {
                  e.stopPropagation();   // prevent popup opening twice
                  openPopup(task);
                  openOverlay();
                }}
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
