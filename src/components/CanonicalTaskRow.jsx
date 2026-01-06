import React from "react";

/*
=====================================================================
METRA — CanonicalTaskRow.jsx
Stage 81 — Step 1 (Task Row Implementation)
---------------------------------------------------------------------
Design-only → Controlled implementation

IMPORTANT:
• This component is NOT wired into the UI.
• It introduces NO new semantics.
• It causes NO browser regression.
• Rendering only — no mutation, no workflow.
=====================================================================
*/

/**
 * Props contract (locked):
 *
 * task: {
 *   id: string
 *   title: string
 *
 *   executionState: "NOT_STARTED" | "IN_PROGRESS" | "EXECUTION_ENDED"
 *   reviewState: "NONE" | "IN_REVIEW"
 *   reviewOutcome: "NONE" | "ACCEPTED" | "REJECTED"
 *
 *   isFlagged: boolean        // reminder (clock)
 *   isEscalated: boolean     // governance
 *   isArchived: boolean
 * }
 *
 * isReadOnly: boolean
 */

export default function CanonicalTaskRow({ task, isReadOnly }) {
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
  // Styling (inline, non-opinionated)
  // -----------------------------
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: baseColor,
    opacity: task.isArchived ? 0.6 : 1,
    cursor: "default",
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
  };

  const iconStyle = {
    fontSize: "14px",
    color: "#374151",
  };

  const readOnlyStyle = isReadOnly
    ? { pointerEvents: "none", opacity: 0.7 }
    : {};

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div style={{ ...rowStyle, ...readOnlyStyle }}>
      {/* Lifecycle */}
      <span style={labelStyle}>{lifecycleLabel}</span>

      {/* Review state */}
      {showInReview && <span style={labelStyle}>In Review</span>}

      {/* Review outcome */}
      {showAccepted && <span style={labelStyle}>Accepted</span>}
      {showRejected && <span style={labelStyle}>Rejected</span>}

      {/* Title */}
      <span style={titleStyle}>{task.title}</span>

      {/* Reminder (Flag → Clock) */}
      {task.isFlagged && (
        <span style={iconStyle} title="Reminder">
          🕒
        </span>
      )}

      {/* Escalation */}
      {task.isEscalated && (
        <span style={iconStyle} title="Escalated">
          ⚑
        </span>
      )}

      {/* Archived */}
      {task.isArchived && <span style={labelStyle}>Archived</span>}
    </div>
  );
}
