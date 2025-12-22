// src/components/PreProject.jsx
import React, { useState } from "react";
import "../Styles/Checklist.css";
import ModuleHeader from "./ModuleHeader";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — Stage 11.2.3
Task Status Updates (Workspace Behaviour)
---------------------------------------------------------------------
• Status field added to tasks
• Status updates reflected immediately
• Notes remain append-only
• No persistence
• No governance
=====================================================================
*/

const initialSummaries = [
  {
    id: "ws-summary-1",
    title: "PreProject — Initial Planning",
    tasks: [
      {
        id: "ws-task-1",
        text: "Define project objectives",
        origin: "workspace",
        status: "Not started",
        notes: [],
      },
      {
        id: "repo-task-1",
        text: "Prepare feasibility assessment",
        origin: "repository",
        status: "Not started",
        notes: [],
      },
    ],
  },
];

export default function PreProject() {
  const [summaries, setSummaries] = useState(initialSummaries);
  const [selected, setSelected] = useState(null);

  const updateTask = (taskId, updater) => {
    setSummaries((prev) =>
      prev.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId ? updater(t) : t
        ),
      }))
    );
  };

  const appendNote = (taskId, noteText) => {
    updateTask(taskId, (t) => ({
      ...t,
      notes: [...t.notes, { text: noteText, ts: new Date().toISOString() }],
    }));
  };

  const changeStatus = (taskId, status) => {
    updateTask(taskId, (t) => ({
      ...t,
      status,
    }));
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
                  <span style={{ opacity: 0.6, marginLeft: "0.5rem" }}>
                    [{task.origin}]
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      marginLeft: "0.75rem",
                      opacity: 0.8,
                    }}
                  >
                    ({task.status})
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
          onStatusChange={(status) => changeStatus(selected.id, status)}
        />
      )}
    </div>
  );
}
