// @ts-nocheck
/*
=====================================================================
METRA — PreProjectFooter.jsx
Stage 182 — Summary Creation (Footer Canonisation)
Stage 353 — Repository Trigger Restoration (UI ONLY)
---------------------------------------------------------------------
- Footer-only creation affordances
- Mirrors task creation pattern
- One click → one object (task or summary)
- Repository trigger is an optional affordance (no mutation here)
- No selection, no navigation, no side effects
=====================================================================
*/

export default function PreProjectFooter({
  canCreateTask,
  onCreateTask,
  canCreateSummary,
  onCreateSummary,
  canOpenRepository = false,
  onOpenRepository,
}) {
  if (
      !canCreateTask &&
      !canCreateSummary &&
      !canOpenRepository
    ) return null;

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
        {canOpenRepository && (
          <button
            type="button"
            onClick={onOpenRepository}
            style={{
              padding: "6px 14px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Repository
          </button>
        )}

    </div>
  );
}
