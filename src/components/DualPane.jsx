/* ======================================================================
   METRA – DualPane.jsx
   v3.9 + Reintegration Mounting for PreProject (Stage 6)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provide left (Management) and right (Development) panes
   ✔ Mount independent PreProject instances in each pane (Option A)
   ✔ Maintain stable v3.9 layout baseline
   ----------------------------------------------------------------------
   NOTE:
   – TaskPopup not yet wired
   – Personnel not yet wired
   – PreProject displays clean lists in both panes
   ====================================================================== */

import React from "react";
import PreProject from "./PreProject.jsx";
import "../Styles/DualPane.css";

export default function DualPane() {
  return (
    <div className="dual-pane-workspace">

      {/* ---------------------------------------------------------------
         Management Pane
         --------------------------------------------------------------- */}
      <div className="pane management-pane">
        <div className="pane-header">Management Workspace</div>

        {/* PreProject instance #1 */}
        <div className="pane-content">
          <PreProject />
        </div>
      </div>

      {/* ---------------------------------------------------------------
         Development Pane
         --------------------------------------------------------------- */}
      <div className="pane development-pane">
        <div className="pane-header">Development Workspace</div>

        {/* PreProject instance #2 */}
        <div className="pane-content">
          <PreProject />
        </div>
      </div>

    </div>
  );
}
