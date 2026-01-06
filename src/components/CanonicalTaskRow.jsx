/*
=====================================================================
METRA — CanonicalTaskRow.jsx
Stage 81 — Step 1 (Task Row Implementation)
Stage 83.1 — Invocation wiring correction
---------------------------------------------------------------------
Render-only. No semantics added.
=====================================================================
*/

export default function CanonicalTaskRow({
  task,
  isReadOnly,
  onTitleClick,
}) {
  if (!task) return null;

  // -----------------------------
  // Colour resolution (Stage 80)
  // -----------------------------
  let baseColor = "#d97706"; // amber default (unresolved)

  if (task.executionState === "NOT_STARTED") {
    baseColor = "#6b7280"; // grey
  }

  if (task.reviewOutcome === "ACCEPTED") {
    baseColor = "#16a34a"; // green (ONLY allowed green)
  }

  if (task.isArchived) {
    baseColor = "#9ca3af"; // muted / archived
  }

  // -----------------------------
  // Labels
  // -----------------------------
  const lifecycleLabel = (() => {
    switch (task.executionState) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_PROGRESS":
        return "In Progress";
      case "EXECUTION_ENDED":
        return "Execution Ended";
      default:
        return "Unknown";
    }
  })();

  const showInReview = task.reviewState === "IN_REVIEW";
  const showAccepted = task.reviewOutcome === "ACCEPTED";
  const showRejected = task.reviewOutcome === "REJECTED";

  // -----------------------------
  // Styling (row remains non-clickable)
  // -----------------------------
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: baseColor,
    opacity: task.isArchived ? 0.6 : 1,
    userSelect: "none",
  };

  const labelStyle = {
    fontSize: "12px",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #e5e7eb",
    color: "#374151",
    background: "#f9fafb",
  };

  const titleStyle = {
    flexGrow: 1,
    color: "#111827",
    textDecoration: task.isArchived ? "line-through" : "none",
    cursor: "pointer",
  };

  const iconStyle = {
    fontSize: "14px",
    color: "#374151",
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div style={rowStyle}>
      {/* Lifecycle */}
      <span style={labelStyle}>{lifecycleLabel}</span>

      {showInReview && <span style={labelStyle}>In Review</span>}
      {showAccepted && <span style={labelStyle}>Accepted</span>}
      {showRejected && <span style={labelStyle}>Rejected</span>}

      {/* Title — sole invocation surface */}
      <span
        style={titleStyle}
        onClick={onTitleClick}
        role="button"
      >
        {task.title}
      </span>

      {task.isFlagged && (
        <span style={iconStyle} title="Reminder">🕒</span>
      )}

      {task.isEscalated && (
        <span style={iconStyle} title="Escalated">⚑</span>
      )}

      {task.isArchived && <span style={labelStyle}>Archived</span>}
    </div>
  );
}
