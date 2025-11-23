/* ======================================================================
   METRA – PaneDev.jsx
   Stage 3.2 – Test Pane (Isolated Layout Debugging)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provide simple placeholder task list for layout testing
   ✔ Avoid loading PreProject logic inside DualPane
   ✔ Ensure clean behaviour with DualPane.css
   ====================================================================== */

import React from "react";

export default function PaneDev() {
  return (
    <div className="task-list">

      <div className="task-item">Development Task 1</div>
      <div className="task-item">Development Task 2</div>
      <div className="task-item">Development Task 3</div>
      <div className="task-item">Development Task 4</div>
      <div className="task-item">Development Task 5</div>
      <div className="task-item">Development Task 6</div>
      <div className="task-item">Development Task 7</div>
      <div className="task-item">Development Task 8</div>

    </div>
  );
}
