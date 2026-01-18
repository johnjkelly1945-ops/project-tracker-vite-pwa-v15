/*
=====================================================================
METRA — CanonicalTaskRow.jsx
Stage 81    — Task Row Rendering
Stage 147   — Gate G2: Task Identity Editing (Unassigned Only)
Stage 150   — Execution State Removed from Row Surface (Corrected)
---------------------------------------------------------------------
- Row click opens inspection popup
- Title click edits identity when permitted
- No execution or lifecycle semantics rendered here
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
        if (!isEditing && onTitleClick) onTitleClick();
      }}
    >
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
