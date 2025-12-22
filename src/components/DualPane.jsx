// src/components/DualPane.jsx
import React from "react";
import "../Styles/DualPane.css";

/*
=====================================================================
METRA — Stage 11.5.2-B
DualPane Shell (Presentation Only)
---------------------------------------------------------------------
• Stateless
• No behaviour
• No logic
• No repository coupling
• No governance
=====================================================================
*/

export default function DualPane({ left, right }) {
  return (
    <div className="dual-pane-root">
      <div className="dual-pane-left">
        {left}
      </div>

      <div className="dual-pane-right">
        {right}
      </div>
    </div>
  );
}
