// @ts-nocheck
/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 146 — Gate G1: Task Creation Authority (Footer Only)
=====================================================================
- Footer-only creation affordance
- Visible only when Gate G1 is open
- One click → one task
- No summaries
- No disabled state
=====================================================================
*/

export default function PreProjectFooter({
  canCreateTask,
  onCreateTask,
}) {
  if (!canCreateTask) return null;

  return (
    <div
      style={{
        height: "44px",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
      }}
    >
      <button
        type="button"
        onClick={onCreateTask}
        style={{
          padding: "6px 14px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Create Task
      </button>
    </div>
  );
}
