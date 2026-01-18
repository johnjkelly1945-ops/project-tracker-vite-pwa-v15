/*
=====================================================================
METRA — CanonicalTaskRow.jsx
Stage 81    — Task Row Rendering
Stage 147   — Gate G2: Task Identity Editing (Unassigned Only)
Stage 148   — Popup Reachability Fix (Instrumented)
---------------------------------------------------------------------
- Row click opens inspection popup
- Title click edits identity when permitted
- TEMP: console log to prove click firing
=====================================================================
*/

import { useState } from "react";

export default function CanonicalTaskRow({
  task,
  isReadOnly,
  onTitleClick,
  canEditIdentity,
  onUpdateTitle,
}) {
  if (!task) return null;

  const isAssigned = !!task.assigneeId;
  const allowEdit = canEditIdentity && !isAssigned && !isReadOnly;

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title || "");

  let baseColor = "#d97706";
  if (task.executionState === "NOT_STARTED") baseColor = "#6b7280";
  if (task.reviewOutcome === "ACCEPTED") baseColor = "#16a34a";
  if (task.isArchived) baseColor = "#9ca3af";

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

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: baseColor,
    opacity: task.isArchived ? 0.6 : 1,
    userSelect: "none",
    cursor: "pointer",
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
      onUpdateTitle(task.id, draftTitle);
    }
  }

  return (
    <div
      style={rowStyle}
      onClick={() => {
        console.log("ROW CLICK FIRED:", task.id);
        if (!isEditing && onTitleClick) onTitleClick(task);
      }}
    >
      <span style={labelStyle}>{lifecycleLabel}</span>

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
