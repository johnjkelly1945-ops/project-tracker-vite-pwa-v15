/* ======================================================================
   METRA – PreProject.jsx
   Stage 5.5 – Summary Expand / Collapse (Safe)
   ----------------------------------------------------------------------
   ✔ Crash-proof rendering
   ✔ Expand / collapse summaries
   ✔ Read-only hierarchy
   ✔ Task click diagnostics only
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/PreProject.css";

export default function PreProject(props) {

  /* --------------------------------------------------------------
     HARD SAFETY CLAMP
     -------------------------------------------------------------- */
  const tasks = Array.isArray(props.tasks) ? props.tasks : [];
  const summaries = Array.isArray(props.summaries) ? props.summaries : [];

  /* --------------------------------------------------------------
     LOCAL UI STATE (SAFE)
     -------------------------------------------------------------- */
  const [openSummaries, setOpenSummaries] = useState({});

  const toggleSummary = (id) => {
    setOpenSummaries(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <div className="preproject-container">

      {/* === SUMMARIES === */}
      {summaries.map(summary => {
        const isOpen = openSummaries[summary.id] ?? true;

        return (
          <div key={summary.id} className="summary-block">

            <div
              className="summary-header"
              onClick={() => toggleSummary(summary.id)}
              style={{ cursor: "pointer" }}
            >
              <strong>{summary.title}</strong>
              <span style={{ marginLeft: "8px", fontSize: "0.85em" }}>
                {isOpen ? "▾" : "▸"}
              </span>
            </div>

            {/* === TASKS UNDER SUMMARY === */}
            {isOpen &&
              tasks
                .filter(t => t.summaryId === summary.id)
                .map(task => (
                  <div
                    key={task.id}
                    className="task-row indented"
                    onClick={() => {
                      console.log("🟢 Task clicked:", task);
                      props.openPopup?.(task);
                    }}
                  >
                    <span className="task-title">{task.title}</span>
                    <span className="task-status">{task.status}</span>
                  </div>
                ))}
          </div>
        );
      })}

      {/* === UNSUMMARISED TASKS === */}
      {tasks
        .filter(t => !t.summaryId)
        .map(task => (
          <div
            key={task.id}
            className="task-row"
            onClick={() => {
              console.log("🟢 Task clicked:", task);
              props.openPopup?.(task);
            }}
          >
            <span className="task-title">{task.title}</span>
            <span className="task-status">{task.status}</span>
          </div>
        ))}

    </div>
  );
}
