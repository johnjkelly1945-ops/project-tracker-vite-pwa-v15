import React from "react";

/*
=====================================================================
METRA — PersonnelPanel.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 255-A — Personnel Module Container (Inert)

PURPOSE
---------------------------------------------------------------------
Provide a canonical, non-behavioural Personnel workspace surface.

• Container-only
• Non-authoritative
• Non-interactive
• Not reachable in UI at this stage

This file introduces no authority, workflow, or behaviour.

=====================================================================
*/

export default function PersonnelPanel() {
  return (
    <div style={{ padding: "16px" }}>
      <h2>Personnel</h2>
      <div style={{ fontStyle: "italic", opacity: 0.7 }}>
        No personnel recorded.
      </div>
    </div>
  );
}
