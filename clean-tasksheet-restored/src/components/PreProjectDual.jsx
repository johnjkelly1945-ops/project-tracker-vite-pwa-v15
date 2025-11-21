/* ======================================================================
   METRA – PreProjectDual.jsx
   Stage 1 – Dual Pane Shell (50/50)
   ----------------------------------------------------------------------
   Pure layout only. No routing logic yet.
   Both panes receive the same content temporarily
   to confirm layout stability before Stage 2 logic.
   ====================================================================== */

import React from "react";
import PaneMgmt from "./PaneMgmt";
import PaneDev from "./PaneDev";

export default function PreProjectDual() {

  return (
    <div className="dual-pane-container">
      <PaneMgmt />
      <PaneDev />
    </div>
  );
}
