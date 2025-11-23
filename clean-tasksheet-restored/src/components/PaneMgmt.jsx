/* ======================================================================
   METRA – PaneMgmt.jsx
   Stage 3.2 – Test Pane (Isolated Layout Debugging)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provide simple placeholder task list for layout testing
   ✔ Avoid loading PreProject logic inside DualPane
   ✔ Ensure clean behaviour with DualPane.css
   ====================================================================== */

import React from "react";

export default function PaneMgmt() {
  return (
    <div className="task-list">

      <div className="task-item">Management Task A</div>
      <div className="task-item">Management Task B</div>
      <div className="task-item">Management Task C</div>
      <div className="task-item">Management Task D</div>
      <div className="task-item">Management Task E</div>
      <div className="task-item">Management Task F</div>
      <div className="task-item">Management Task G</div>
      <div className="task-item">Management Task H</div>

    </div>
  );
}
