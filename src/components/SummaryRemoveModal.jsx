// @ts-nocheck
import React from "react";

/*
=====================================================================
METRA — SummaryRemoveModal.jsx
Stage 190 — Summary Removal Confirmation
---------------------------------------------------------------------
PURPOSE:
• Explicit confirmation for Summary removal
• Archive is named but not defined
• No task mutation
• No lifecycle, restore, or visibility semantics

SCOPE:
• Modal-only
• User-initiated
• Deterministic
=====================================================================
*/

export default function SummaryRemoveModal({
  open,
  summaryTitle,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "6px",
          width: "320px",
        }}
      >
        <h3>Remove summary?</h3>

        <p>
          This will remove the summary
          {summaryTitle ? ` “${summaryTitle}”` : ""} from the workspace.
        </p>

        <p>Tasks linked to this summary will not be changed.</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}
