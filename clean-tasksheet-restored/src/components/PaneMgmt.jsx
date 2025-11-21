/* ======================================================================
   METRA – PaneMgmt.jsx
   Stage 2 – Independent Scroll + Sticky Header
   ----------------------------------------------------------------------
   Renders:
   ✔ Sticky pane header ("Management")
   ✔ Scrollable content region
   ✔ PreProject placed inside scroll container
   ✔ Standard spacing (your choice A)
   ====================================================================== */

import React from "react";
import PreProject from "./PreProject";

export default function PaneMgmt() {
  return (
    <div className="pane pane-mgmt">
      
      {/* Sticky header */}
      <h2 className="pane-header">Management</h2>

      {/* Scrollable content */}
      <div className="pane-content">
        <PreProject />
      </div>

    </div>
  );
}
