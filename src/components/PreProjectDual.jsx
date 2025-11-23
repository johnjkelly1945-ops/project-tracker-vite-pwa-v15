/* ======================================================================
   METRA – PreProjectDual.jsx
   Stage 3.7 – Dual Pane Wrapper Restored
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Wrap management + development panes in dual-pane-workspace
   ✔ Ensure DualPane.css controls height + scroll
   ✔ Restore independent scrolling for both panes
   ====================================================================== */

import React from "react";
import PaneMgmt from "./PaneMgmt.jsx";
import PaneDev from "./PaneDev.jsx";

import "../Styles/DualPane.css";

export default function PreProjectDual() {
  return (
    <div className="dual-pane-workspace">
      <PaneMgmt />
      <PaneDev />
    </div>
  );
}
