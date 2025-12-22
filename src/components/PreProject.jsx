// src/components/PreProject.jsx
import React from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";

/*
=====================================================================
METRA — Stage 11.1
Workspace Summary & Task Instantiation (STRUCTURAL ONLY)
---------------------------------------------------------------------
• Explicit workspace summaries and tasks
• Mixed-origin tasks (workspace + repository)
• Inert rendering (no behaviour)
• No persistence
• No popup
• No governance
=====================================================================
*/

// ------------------------------------------------------------------
// Temporary workspace structures (Stage 11.1 only)
// ------------------------------------------------------------------

const workspaceSummaries = [
  {
    id: "ws-summary-1",
    title: "PreProject — Initial Planning",
    tasks: [
      {
        id: "ws-task-1",
        text: "Define project objectives",
        origin: "workspace",
      },
      {
        id: "repo-task-1",
        text: "Prepare feasibility assessment",
        origin: "repository",
      },
    ],
  },
];

export default function PreProject() {
  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />

      {/* Stage 11.1: Render summaries and tasks inertly */}
      {workspaceSummaries.map((summary) => (
        <div key={summary.id} style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{summary.title}</h3>

          <ul>
            {summary.tasks.map((task) => (
              <li key={task.id}>
                <div className="row">
                  <span>{task.text}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.6,
                      marginLeft: "0.5rem",
                    }}
                  >
                    [{task.origin}]
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
