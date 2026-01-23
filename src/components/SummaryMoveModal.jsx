// @ts-nocheck
import React from "react";

/*
=====================================================================
METRA — SummaryMoveModal.jsx
Stage 189 — Summary Movement
Stage 190 — Summary Removal (Action Exposure Only)
---------------------------------------------------------------------
CHANGE (STAGE 190):
• Expose "Remove summary" action
• Delegate removal request to caller
• No lifecycle, archive, or task semantics added

INVARIANTS:
• Movement semantics unchanged
• No task mutation
• No archive definition
=====================================================================
*/

export default function SummaryMoveModal({
  open,
  summaryTitle,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onClose,
  onRequestRemove,
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
        <h3>Summary actions</h3>

        {summaryTitle && <p>{summaryTitle}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={onMoveUp} disabled={isFirst}>
            Move up
          </button>

          <button onClick={onMoveDown} disabled={isLast}>
            Move down
          </button>

          <hr />

          <button
            onClick={onRequestRemove}
            style={{ color: "#b00020" }}
          >
            Remove summary
          </button>
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
