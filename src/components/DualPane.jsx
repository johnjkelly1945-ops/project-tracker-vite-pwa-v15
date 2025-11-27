/* ======================================================================
   METRA – DualPane.jsx
   v6.3 – Corrected for full PreProject reintegration (v7 A2)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Left pane = PreProject (fully functional)
   ✔ Right pane = Development Tasks (empty until repository injection)
   ✔ Independent scroll areas
   ✔ Sticky headers inside each pane
   ✔ Compatible with v6.3 CSS offsets
   ✔ Clean integration with PreProject.jsx (A2 build)
   ====================================================================== */

import React from "react";
import PreProject from "./PreProject.jsx";

import "../Styles/DualPane.css";

export default function DualPane() {
  return (
    <div className="dual-pane-workspace">

      {/* ------------------------------------------------------------
          LEFT PANE – MANAGEMENT TASKS (ACTIVE PreProject Workspace)
         ------------------------------------------------------------ */}
      <div className="pane mgmt-pane">

        <div className="pane-header">
          <h2>Management Tasks</h2>
        </div>

        {/* Scrollable area */}
        <div className="pane-content">
          <PreProject />
        </div>

      </div>


      {/* ------------------------------------------------------------
          RIGHT PANE – DEVELOPMENT TASKS
          (empty until repository templates GET injected)
         ------------------------------------------------------------ */}
      <div className="pane dev-pane">

        <div className="pane-header">
          <h2>Development Tasks</h2>
        </div>

        {/* Scrollable area */}
        <div className="pane-content dev-empty">
          {/* Placeholder text until integration */}
          <p className="dev-placeholder">No Development Tasks yet</p>
        </div>

      </div>

    </div>
  );
}
