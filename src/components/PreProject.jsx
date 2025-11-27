/* ======================================================================
   METRA – PreProject.jsx
   v6.3 – Fully Restored PreProject → DualPane Architecture
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Owns ALL task logic
   ✔ Provides mgmt/dev task lists
   ✔ Provides popup logic
   ✔ Provides test tasks for DualPane scrolling
   ✔ Clean, stable, no repository logic
   ====================================================================== */

import React, { useState } from "react";

import DualPane from "./DualPane.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProject() {

  console.log(">>> PreProject.jsx loaded (v6.3)");

  /* -------------------------------------------------------------------
     DEFAULT TASKS (includes scroll-test block)
     ------------------------------------------------------------------- */
  const defaultTasks = [
    { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
    { id: 2, title: "Initial Risk Scan", status: "Not Started" },
    { id: 3, title: "Stakeholder Mapping", status: "In Progress" },

    // LARGE BLOCK FOR SCROLL TESTING
    { id: 10, title: "Test Task A", status: "Not Started" },
    { id: 11, title: "Test Task B", status: "Not Started" },
    { id: 12, title: "Test Task C", status: "Not Started" },
    { id: 13, title: "Test Task D", status: "Not Started" },
    { id: 14, title: "Test Task E", status: "Not Started" },
    { id: 15, title: "Test Task F", status: "Not Started" },
    { id: 16, title: "Test Task G", status: "Not Started" },
    { id: 17, title: "Test Task H", status: "Not Started" },
    { id: 18, title: "Test Task I", status: "Not Started" },
    { id: 19, title: "Test Task J", status: "Not Started" }
  ];

  /* -------------------------------------------------------------------
     SPLIT INTO MGMT / DEV
     ------------------------------------------------------------------- */
  const mgmtTasks = defaultTasks.slice(0, 5);
  const devTasks  = defaultTasks.slice(5);

  /* -------------------------------------------------------------------
     POPUP CONTROL
     ------------------------------------------------------------------- */
  const [activeTask, setActiveTask] = useState(null);

  const handleTaskClick = (task) => {
    console.log(">>> PreProject: Task clicked:", task.title);
    setActiveTask(task);
  };

  const closePopup = () => setActiveTask(null);

  /* -------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------- */
  return (
    <div className="preproject-container">

      {/* === DUAL PANE === */}
      <DualPane
        mgmtTasks={mgmtTasks}
        devTasks={devTasks}
        onTaskClick={handleTaskClick}
      />

      {/* === POPUP === */}
      {activeTask && (
        <TaskPopup task={activeTask} onClose={closePopup} />
      )}

    </div>
  );
}
