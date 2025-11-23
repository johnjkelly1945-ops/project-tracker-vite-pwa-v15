/* ======================================================================
   METRA – DualPane.jsx
   Phase 3A – Step 3
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Add safe per-pane task selection
   ✔ No popup, no pipeline, no risk of interference
   ✔ Shared selection state lives ONLY in DualPane
   ====================================================================== */

import React, { useState } from "react";
import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";

import "../Styles/DualPane.css";

export default function DualPane() {

  // --- Shared selected task (string id) ---
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="dual-pane-workspace">

      {/* === Management Pane ============================================= */}
      <div className="pane pane-mgmt">
        <div className="pane-header">Management</div>
        <div className="pane-content">
          <PaneMgmt
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </div>
      </div>

      {/* === Development Pane ============================================ */}
      <div className="pane pane-dev">
        <div className="pane-header">Development</div>
        <div className="pane-content">
          <PaneDev
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </div>
      </div>

    </div>
  );
}
