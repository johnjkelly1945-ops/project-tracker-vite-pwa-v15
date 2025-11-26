/* ======================================================================
   METRA – DualPane.jsx
   Phase 6.2b – Full DualPane Reintegration (Management + Development)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Restores left/right dual-pane layout
   ✔ Accepts mgmtTasks + devTasks from PreProject
   ✔ Handles popup open/close for tasks
   ✔ Ensures independent scrolling & clean layout
   ✔ No repository routing in this phase
   ====================================================================== */

import React, { useState } from "react";
import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";
import TaskPopup from "./TaskPopup.jsx";
import "../Styles/DualPane.css";

export default function DualPane({ mgmtTasks, devTasks, onTaskUpdate }) {
  console.log(">>> DualPane.jsx mounted (Phase 6.2b)");

  // Active popup data
  const [activeTask, setActiveTask] = useState(null);

  const openPopup = (task) => {
    console.log(">>> Opening popup for task:", task.title);
    setActiveTask(task);
  };

  const closePopup = () => {
    console.log(">>> Closing popup");
    setActiveTask(null);
  };

  const updateTask = (updatedTask) => {
    onTaskUpdate(updatedTask); // passes up to PreProject
  };

  return (
    <div className="dual-pane-workspace">

      {/* MANAGEMENT PANE (left) */}
      <PaneMgmt
        tasks={mgmtTasks}
        onTaskClick={openPopup}
      />

      {/* DEVELOPMENT PANE (right) */}
      <PaneDev
        tasks={devTasks}
        onTaskClick={openPopup}
      />

      {/* POPUP RENDER */}
      {activeTask && (
        <TaskPopup
          task={activeTask}
          onClose={closePopup}
          onUpdate={updateTask}
        />
      )}

    </div>
  );
}
