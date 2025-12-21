/* ======================================================================
   METRA — PreProject.jsx
   Stage 11.2.x — Task Click Forwarding Restored
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Render summaries and tasks (workspace-authoritative)
   ✔ Forward task click events to parent (DualPane)
   ✔ No popup logic
   ✔ No governance
   ✔ No documents
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PreProject({
  summaries = [],
  tasks = [],
  onTaskClick
}) {
  function handleTaskClick(task) {
    console.log("🟢 Task clicked:", task);
    if (onTaskClick) onTaskClick(task);
  }

  return (
    <div className="preproject-container">
      {summaries.map(summary => (
        <div key={summary.id} className="summary-block">
          <div className="summary-title">
            {summary.title}
          </div>

          {tasks
            .filter(task => task.summaryId === summary.id)
            .map(task => (
              <div
                key={task.id}
                className="task-row"
                onClick={() => handleTaskClick(task)}
              >
                {task.title}
              </div>
            ))}
        </div>
      ))}

      {tasks
        .filter(task => !task.summaryId)
        .map(task => (
          <div
            key={task.id}
            className="task-row orphan-task"
            onClick={() => handleTaskClick(task)}
          >
            {task.title}
          </div>
        ))}
    </div>
  );
}
