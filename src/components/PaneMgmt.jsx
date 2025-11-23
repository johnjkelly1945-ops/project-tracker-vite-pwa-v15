/* ======================================================================
   METRA – PaneMgmt.jsx
   Phase 3A – Step 3
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Click to highlight tasks
   ✔ Safe isolated behaviour
   ====================================================================== */

import React from "react";

export default function PaneMgmt({ selectedTask, setSelectedTask }) {
  return (
    <div className="task-list">
      {[...Array(50)].map((_, i) => {
        const id = `mgmt-${i}`;
        const isSelected = selectedTask === id;

        return (
          <div
            key={id}
            className={`task-item ${isSelected ? "selected-task" : ""}`}
            onClick={() => setSelectedTask(id)}
          >
            Management Task {i + 1}
          </div>
        );
      })}
    </div>
  );
}
