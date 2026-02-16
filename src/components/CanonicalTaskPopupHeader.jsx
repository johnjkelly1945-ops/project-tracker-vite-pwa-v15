// @ts-nocheck
/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 207 — Popup Header Canonicalisation
Stage 257 Addendum — Personnel Name Resolution (UI Only)
Stage 257-C — Header Layout Canonical Correction (UI Only)
Stage 325 — SEM-TS Identity Row Realisation (UI ONLY)
---------------------------------------------------------------------
Purpose:
• Display single-line Transaction Surface identity row
• Include Title, Summary (if present), Assignee, State
• Preserve centered layout
• UI-only, read-only, non-authoritative
=====================================================================
*/

import React from "react";
import { personnel } from "../data/personnel";

export default function CanonicalTaskPopupHeader({
  task,
  summaryTitle,
  executionState,
  onClose,
}) {
  if (!task) return null;

  const assigneeId = task.assigneeId;

  const assignee =
    assigneeId &&
    personnel.find((p) => p.id === assigneeId);

  const assigneeLabel = assignee
    ? assignee.displayName
    : assigneeId || "Unassigned";

  const stateLabel = executionState || "NOT_STARTED";

  return (
    <div
      style={{
        background: "#0b3a66",
        color: "#fff",
        padding: "12px 16px",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "18px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {task.title}
        {summaryTitle && ` — ${summaryTitle}`}
        {` · ${assigneeLabel}`}
        {` · ${stateLabel}`}
      </div>

      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
