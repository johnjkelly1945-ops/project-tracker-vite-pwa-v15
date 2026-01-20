// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 168 — Wire Task Row Click to Inspection Popup
---------------------------------------------------------------------
• Content-only workspace body
• Wires CanonicalTaskRow row click → onOpenTask(task)
• NO pane headers
• NO arrows
• NO layout ownership
• Preserves G1 footer semantics
=====================================================================
*/

export default function PreProject({
  tasks = [],
  onOpenTask,
  canCreateTask = false,
  onCreateTask,
}) {
  return (
    <div
      className="preproject-content"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ================= TASK LIST / EMPTY STATE ================= */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
        }}
      >
        {tasks.length === 0 ? (
          <>
            <p>No tasks in workspace.</p>
            <p>Operational view.</p>
          </>
        ) : (
          tasks.map((task) => (
            <CanonicalTaskRow
              key={task.id}
              task={task}
              onTitleClick={() => onOpenTask(task)}
            />
          ))
        )}
      </div>

      {/* ================= FOOTER (G1 — SINGLE-PANE ONLY) ================= */}
      <PreProjectFooter
        canCreateTask={canCreateTask}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
