// @ts-nocheck

/*
=====================================================================
METRA — PreProjectDual.jsx
Stage 158 — Pane-Scoped Inspection Renderer
---------------------------------------------------------------------
• Inspection-only
• Pane-scoped rendering
• No execution
• No authority
=====================================================================
*/

export default function PreProjectDual({
  workspaceTasks = [],
  pane, // "management" | "development"
}) {
  if (pane === "management") {
    return (
      <div>
        <h2>Management</h2>
        {workspaceTasks.length === 0 ? (
          <p>No tasks in workspace.</p>
        ) : (
          <ul>
            {workspaceTasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (pane === "development") {
    return (
      <div>
        <h2>Development</h2>
        <p>Development pane not active yet.</p>
      </div>
    );
  }

  return null;
}
