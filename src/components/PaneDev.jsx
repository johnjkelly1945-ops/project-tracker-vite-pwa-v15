/* ======================================================================
   METRA – PaneDev.jsx
   Phase 3A – Step 3
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Click to highlight tasks
   ✔ Safe isolated behaviour
   ====================================================================== */

import React from "react";

export default function PaneDev({ selectedTask, setSelectedTask }) {
  return (
    <div className="task-list">
      {[...Array(50)].map((_, i) => {
        const id = `dev-${i}`;
        const isSelected = selectedTask === id;

        return (
          <div
            key={id}
            className={`task-item ${isSelected ? "selected-task" : ""}`}
            onClick={() => setSelectedTask(id)}
          >
            Development Task {i + 1}
          </div>
        );
      })}
    </div>
  );
}
