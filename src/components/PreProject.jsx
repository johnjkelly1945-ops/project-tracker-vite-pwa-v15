// src/components/PreProject.jsx
import React, { useState } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — Stage 11.2.1
Task Selection & Popup Open / Close
---------------------------------------------------------------------
• Workspace summaries retained
• Clicking a task opens TaskPopup
• Popup closes cleanly
• No behaviour beyond selection
=====================================================================
*/

// ------------------------------------------------------------------
// Temporary workspace structures (Stage 11.2.1)
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
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />

      {workspaceSummaries.map((summary) => (
        <div key={summary.id} style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{summary.title}</h3>

          <ul>
            {summary.tasks.map((task) => (
              <li
                key={task.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTask(task)}
              >
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

      {/* Stage 11.2.1 — Popup open / close only */}
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
