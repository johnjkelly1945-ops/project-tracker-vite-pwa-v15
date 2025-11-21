/* ======================================================================
   METRA – PaneDev.jsx
   Stage 2 – Independent Scroll + Sticky Header
   ----------------------------------------------------------------------
   Mirrors PaneMgmt structure:
   ✔ Sticky pane header ("Development")
   ✔ Scrollable content region
   ✔ PreProject placed inside scroll container
   ====================================================================== */

import React from "react";
import PreProject from "./PreProject";

export default function PaneDev() {
  return (
    <div className="pane pane-dev">

      {/* Sticky header */}
      <h2 className="pane-header">Development</h2>

      {/* Scrollable content */}
      <div className="pane-content">
        <PreProject />
      </div>

    </div>
  );
}
