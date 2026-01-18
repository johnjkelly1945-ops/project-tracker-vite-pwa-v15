// @ts-nocheck
/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 150 — Inspection Header (Execution State Included)
=====================================================================
- Displays task identity
- Displays assignment
- Displays execution state (read-only)
=====================================================================
*/

export default function CanonicalTaskPopupHeader({ task }) {
  if (!task) return null;

  const executionState = task.executionState || "NOT_STARTED";

  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>{task.title}</h3>
      </div>

      <div style={{ marginTop: "6px" }}>
        <strong>Execution state:</strong>{" "}
        {executionState.replace("_", " ")}
      </div>

      {task.assigneeId && (
        <div style={{ marginTop: "6px" }}>
          <strong>Assigned:</strong>{" "}
          {task.assigneeLabel || task.assigneeId}
        </div>
      )}

      <hr style={{ marginTop: "10px" }} />
    </div>
  );
}
