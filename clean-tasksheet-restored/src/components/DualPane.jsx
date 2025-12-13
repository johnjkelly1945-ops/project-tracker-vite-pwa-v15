/* ======================================================================
   METRA – DualPane.jsx
   Stage 5.6 – Summary Capability Verified (Clean)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Flat task rendering restored
   ✔ Summary capability remains available (via props)
   ✔ Task click → popup wiring intact
   ✔ No demo data
   ✔ No repo logic
   ✔ No scroll changes
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ================================================================
     BASE STATE (CLEAN, REAL)
     ================================================================ */
  const [mgmtTasks] = useState([
    { id: 1, title: "Define Project Justification", status: "Not Started" },
    { id: 2, title: "Identify Options and Feasibility", status: "Not Started" },
  ]);

  const [devTasks] = useState([]);

  const [mgmtSummaries] = useState([]);
  const [devSummaries] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  /* ================================================================
     CLICK HANDLERS
     ================================================================ */
  const openTaskPopup = (task, pane) => {
    console.log("🟢 Task clicked:", task);
    setSelectedTask(task);
    setSelectedPane(pane);
  };

  const closeTaskPopup = () => {
    setSelectedTask(null);
    setSelectedPane(null);
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="dual-pane-workspace">

      {/* ================= MANAGEMENT ================= */}
      <div className="pane mgmt-pane">

        <div className="pane-header">
          <h2>Management Tasks</h2>
        </div>

        <FilterBar mode="mgmt" />

        <div className="pane-content">
          <PreProject
            pane="mgmt"
            tasks={mgmtTasks}
            summaries={mgmtSummaries}
            openPopup={(task) => openTaskPopup(task, "mgmt")}
          />
        </div>

      </div>

      {/* ================= DEVELOPMENT ================= */}
      <div className="pane dev-pane">

        <div className="pane-header">
          <h2>Development Tasks</h2>
        </div>

        <FilterBar mode="dev" />

        <div className="pane-content">
          <PreProject
            pane="dev"
            tasks={devTasks}
            summaries={devSummaries}
            openPopup={(task) => openTaskPopup(task, "dev")}
          />
        </div>

      </div>

      {/* ================= TASK POPUP ================= */}
      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
          />,
          document.getElementById("metra-popups")
        )}

    </div>
  );
}
