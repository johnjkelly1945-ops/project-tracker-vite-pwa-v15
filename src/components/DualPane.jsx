/* ======================================================================
   METRA – DualPane.jsx
   Reintegration Mode – v6.2 (Option A: Restore Known-Good Structure)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Hosts the two independent scroll panes (Mgmt / Dev)
   ✔ Receives tasks + handlers from App.jsx
   ✔ Ensures clicking any task opens TaskPopup
   ✔ NO NEW LOGIC ADDED – clean restoration only
   ====================================================================== */

import React from "react";


import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";

// Correct CSS for dual-pane mode
import "../Styles/DualPane.css";



export default function DualPane({ mgmtTasks, devTasks, onTaskClick }) {

  console.log(">>> DualPane.jsx loaded – Mgmt:", mgmtTasks?.length || 0, 
              " Dev:", devTasks?.length || 0);

  return (
    <div className="dual-pane-workspace">

      {/* LEFT – MANAGEMENT PANE */}
      <PaneMgmt
        tasks={mgmtTasks}
        onTaskClick={onTaskClick}
      />

      {/* RIGHT – DEVELOPMENT PANE */}
      <PaneDev
        tasks={devTasks}
        onTaskClick={onTaskClick}
      />

    </div>
  );
}
