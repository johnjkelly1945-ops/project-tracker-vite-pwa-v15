/* ======================================================================
   METRA – PreProjectDual.jsx
   Stage 12.4-A – Workspace Task Rendering (Read-Only)
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Render workspace tasks passed from PreProject
   • Read-only presentation
   • No execution authority
   • No activation logic
   • No mutation
   ====================================================================== */

import React from "react";

export default function PreProjectDual({
  workspaceTasks = []
}) {
  return (
    <div className="pp-dual-wrapper">

      {/* ===== Management Pane ===== */}
      <div className="pp-pane pp-pane-mgmt">
        <h2 className="pp-pane-title">Management</h2>

        {workspaceTasks.length === 0 && (
          <div className="pp-empty">
            No tasks in workspace.
          </div>
        )}

        {workspaceTasks.map(task => (
          <div
            key={task.id}
            className="pp-task-card inactive"
          >
            <div className="pp-task-title">
              {task.title}
            </div>

            {task.description && (
              <div className="pp-task-desc">
                {task.description}
              </div>
            )}

            <div className="pp-task-status">
              Status: inactive
            </div>
          </div>
        ))}
      </div>

      {/* ===== Development Pane (reserved) ===== */}
      <div className="pp-pane pp-pane-dev">
        <h2 className="pp-pane-title">Development</h2>

        <div className="pp-empty">
          Development pane not active yet.
        </div>
      </div>

    </div>
  );
}
