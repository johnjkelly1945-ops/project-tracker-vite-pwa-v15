// @ts-nocheck
/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 182 — Summary Creation (Footer Canonisation)
---------------------------------------------------------------------
- Footer-only creation affordances
- Mirrors task creation pattern
- One click → one object (task or summary)
- No selection, no navigation, no side effects
=====================================================================
*/

export default function PreProjectFooter({
  canCreateTask,
  onCreateTask,
  canCreateSummary,
  onCreateSummary,
}) {
  if (!canCreateTask && !canCreateSummary) return null;

  return (
    <div
      style={{
        height: "44px",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        background: "#fafafa",
      }}
    >
      {canCreateTask && (
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
      )}

      {canCreateSummary && (
        <button
          type="button"
          onClick={onCreateSummary}
          style={{
            padding: "6px 14px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create Summary
        </button>
      )}
    </div>
  );
}
