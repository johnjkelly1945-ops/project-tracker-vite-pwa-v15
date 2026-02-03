// @ts-nocheck
/*
=====================================================================
METRA — CanonicalTaskPopupHeader.jsx
Stage 207 — Popup Header Canonicalisation
Stage 257 Addendum — Personnel Name Resolution (UI Only)
Stage 257-C — Header Layout Canonical Correction (UI Only)
---------------------------------------------------------------------
Purpose:
• Display task title and assignee
• Resolve assigneeId via canonical Personnel data source
• Visually centre header content
• UI-only, read-only, non-authoritative
=====================================================================
*/

import React from "react";
import { personnel } from "../data/personnel";

export default function CanonicalTaskPopupHeader({ task, onClose }) {
  if (!task) return null;

  const assigneeId = task.assigneeId;

  const assignee =
    assigneeId &&
    personnel.find((p) => p.id === assigneeId);

  const assigneeLabel = assignee
    ? assignee.displayName
    : assigneeId || "Unassigned";

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
      {/* Centered title + assignee (single-line canonical layout) */}
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
        {assigneeLabel && ` — ${assigneeLabel}`}
      </div>

      {/* Close control */}
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
