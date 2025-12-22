// src/components/DualPane.jsx
import React from "react";
import "../Styles/DualPane.css";

/*
=====================================================================
METRA — Phase 1
DualPane Container (ACTIVE LAYOUT, NO BEHAVIOUR)
---------------------------------------------------------------------
• Presentation container only
• No state
• No behaviour
• Workspace remains authoritative
=====================================================================
*/

export default function DualPane({ left, right }) {
  return (
    <div className="dual-pane">
      <div className="dual-pane-left">
        {left}
      </div>

      <div className="dual-pane-right">
        {right}
      </div>
    </div>
  );
}
