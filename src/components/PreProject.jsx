// src/components/PreProject.jsx
import React from "react";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — Stage 11.5.3
PreProject Workspace (INTENT-ONLY FOOTER)
---------------------------------------------------------------------
• Safe empty render
• No task creation
• No state mutation
=====================================================================
*/

export default function PreProject() {
  return (
    <div className="preproject-root">
      <div className="preproject-header">
        <h1>PreProject Workspace</h1>
      </div>

      <div className="preproject-content">
        <p>No tasks in workspace</p>
      </div>

      <PreProjectFooter />
    </div>
  );
}
