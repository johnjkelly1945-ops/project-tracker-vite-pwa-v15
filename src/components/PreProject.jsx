// src/components/PreProject.jsx
import React, { useState } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — Stage 11.2.2
Append-Only Notes (Workspace Behaviour)
---------------------------------------------------------------------
• Workspace summaries retained
• TaskPopup supports append-only notes
• Notes stored in workspace state
• No persistence
• No status changes
=====================================================================
*/

// ------------------------------------------------------------------
// Workspace structures with notes (Stage 11.2.2)
// ------------------------------------------------------------------

const initialSummaries = [
  {
    id: "ws-summary-1",
    title: "PreProject — Initial Planning",
    tasks: [
      {
        id: "ws-task-1",
        text: "Define project objectives",
        origin: "workspace",
        notes: [],
      },
      {
        id: "repo-task-1",
        text: "Prepare feasibility assessment",
        origin: "repository",
        notes: [],
      },
    ],
  },
];

export default function PreProject() {
  const [summaries, setSummaries] = useState(initialSummaries);
  const [selected, setSelected] = useState(null);

  const appendNote = (taskId, noteText) => {
    setSummaries((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                notes: [
                  ...t.notes,
                  { text: noteText, ts: new Date().toISOString() },
                ],
              }
            : t
        ),
      }))
    );
  };

  return (
    <div className="checklist">
      <ModuleHeader title="PreProject Module" />

      {summaries.map((summary) => (
        <div key={summary.id} style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{summary.title}</h3>

          <ul>
            {summary.tasks.map((task) => (
              <li
                key={task.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(task)}
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

      {selected && (
        <TaskPopup
          task={selected}
          onClose={() => setSelected(null)}
          onAppendNote={(text) => appendNote(selected.id, text)}
        />
      )}
    </div>
  );
}
