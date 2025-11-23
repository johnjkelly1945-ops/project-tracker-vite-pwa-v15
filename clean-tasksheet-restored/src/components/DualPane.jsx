/* ======================================================================
   METRA – DualPane.jsx
   Stage 3.8 – Header Restore + Scroll Boundary Fix
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Ensure each pane contains a visible sticky header
   ✔ Prevent layout overrides from PaneMgmt / PaneDev
   ✔ Restore scroll boundaries for DualPane.css to operate
   ====================================================================== */

import React from "react";
import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";

import "../Styles/DualPane.css";

export default function DualPane() {
  return (
    <div className="dual-pane-workspace">

      {/* === Management Pane ============================================= */}
      <div className="pane pane-mgmt">

        {/* RESTORED HEADER */}
        <div className="pane-header">Management</div>

        {/* Protected scroll container */}
        <div className="pane-content">
          <PaneMgmt />
        </div>
      </div>

      {/* === Development Pane ============================================ */}
      <div className="pane pane-dev">

        {/* RESTORED HEADER */}
        <div className="pane-header">Development</div>

        {/* Protected scroll container */}
        <div className="pane-content">
          <PaneDev />
        </div>
      </div>

    </div>
  );
}
