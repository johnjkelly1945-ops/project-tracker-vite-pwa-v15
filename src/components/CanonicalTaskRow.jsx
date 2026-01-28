/*
=====================================================================
METRA — CanonicalTaskRow.jsx
Stage 175.0A — Restore Task Inspection Click (Regression Fix)
Stage 230   — Inline Task Status Indicator (Canonical Dot Projection)
---------------------------------------------------------------------
- Row click opens inspection popup
- Title click edits identity when permitted
- Inline status dot reflects canonical executionState ONLY
- Status dot is inert and non-interactive
- No execution, lifecycle, or authority semantics introduced
=====================================================================
*/

import { useState } from "react";

export default function CanonicalTaskRow({
  task,
  isReadOnly,
  onOpenTask,
  canEditIdentity,
  onUpdateTitle,
}) {
  if (!task) return null;

  const isAssigned = !!task.assigneeId;
  const allowEdit = canEditIdentity && !isAssigned && !isReadOnly;

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title || "");

  /* ===============================================================
     Canonical executionState → dot colour mapping (UX projection only)
     =============================================================== */
  function getStatusDotColor(executionState) {
    switch (executionState) {
      case "IN_PROGRESS":
        return "#7c3aed"; // purple
      case "SUBMITTED":
        return "#f59e0b"; // amber
      case "COMPLETED":
        return "#22c55e"; // green
      case "NOT_STARTED":
      default:
        return "#9ca3af"; // grey
    }
  }

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
    opacity: task.isArchived ? 0.6 : 1,
    userSelect: "none",
    cursor: "pointer",
  };

  const statusDotStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: getStatusDotColor(task.executionState),
    flexShrink: 0,
    pointerEvents: "none", // CRITICAL: prevent focus / click interception
  };

  const titleStyle = {
    flexGrow: 1,
    color: "#111827",
    cursor: allowEdit ? "text" : "pointer",
  };

  const inputStyle = {
    flexGrow: 1,
    fontSize: "14px",
    padding: "2px 4px",
  };

  function commitTitle() {
    setIsEditing(false);
    if (draftTitle !== task.title) {
      onUpdateTitle?.(task.id, draftTitle);
    }
  }

  return (
    <div
      style={rowStyle}
      onClick={() => {
        if (!isEditing && onOpenTask) onOpenTask(task);
      }}
    >
      <span style={statusDotStyle} />

      {isEditing ? (
        <input
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitTitle();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
          style={inputStyle}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          style={titleStyle}
          onClick={(e) => {
            e.stopPropagation();
            if (allowEdit) setIsEditing(true);
          }}
        >
          {task.title || "Untitled Task"}
        </span>
      )}
    </div>
  );
}
