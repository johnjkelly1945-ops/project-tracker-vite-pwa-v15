// @ts-nocheck
import React from "react";
import CanonicalTaskRow from "./CanonicalTaskRow";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 167 — Content-Only Workspace Body (DualPane-Owned Shell)
---------------------------------------------------------------------
• Content-only component
• NO pane headers
• NO arrows
• NO layout ownership
• Renders task list
• Mounts G1 footer (single-pane only, via props)
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
              onOpenTask={onOpenTask}
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
