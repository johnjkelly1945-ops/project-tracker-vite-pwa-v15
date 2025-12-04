/* ======================================================================
   METRA – PreProjectDual.jsx
   Step 3 – Simple Popup Integration
   ====================================================================== */

import React, { useState } from "react";
import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";
import TaskPopup from "./TaskPopup.jsx";

import "../Styles/PreProject.css";

export default function PreProjectDual() {

  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="preproject-inner">

      {/* === Popup (if task selected) === */}
      <TaskPopup task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* === MANAGEMENT PANE === */}
      <div className="preproject-pane preproject-pane-mgmt">
        <h2 className="preproject-header">Management</h2>
        <PaneMgmt onTaskClick={(t) => setSelectedTask(t)} />
      </div>

      {/* === DEVELOPMENT PANE === */}
      <div className="preproject-pane preproject-pane-dev">
        <h2 className="preproject-header">Development</h2>
        <PaneDev onTaskClick={(t) => setSelectedTask(t)} />
      </div>

    </div>
  );
}
