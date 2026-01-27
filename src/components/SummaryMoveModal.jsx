// @ts-nocheck
import React, { useState } from "react";

/*
=====================================================================
METRA — SummaryMoveModal.jsx
Stage 220 — Explicit Summary Movement Authority (Confirmed Removal)
---------------------------------------------------------------------
• Summary-scoped modal only
• One click → one action
• Destructive action requires confirmation
• Summary removal is conceptualised as "archived"
• Archive mechanics defined in a future stage
=====================================================================
*/

export default function SummaryMoveModal({
  summaryId,
  summaries = [],
  onMove,
  onRemove,
  onClose,
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const index = summaries.findIndex((s) => s.id === summaryId);
  const atTop = index <= 0;
  const atBottom = index === summaries.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "16px",
          minWidth: "280px",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Summary Actions</h3>

        {!confirmingRemove && (
          <>
            {!atTop && (
              <button
                type="button"
                onClick={() => onMove(summaryId, "up")}
                style={{ display: "block", marginBottom: "8px" }}
              >
                ↑ Move Up
              </button>
            )}

            {!atBottom && (
              <button
                type="button"
                onClick={() => onMove(summaryId, "down")}
                style={{ display: "block", marginBottom: "8px" }}
              >
                ↓ Move Down
              </button>
            )}

            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              style={{
                display: "block",
                marginBottom: "12px",
                color: "#a00",
              }}
            >
              Remove Summary
            </button>

            <button type="button" onClick={onClose}>
              Close
            </button>
          </>
        )}

        {confirmingRemove && (
          <>
            <p style={{ marginBottom: "12px" }}>
              This will remove the summary. Tasks will remain.
            </p>

            <button
              type="button"
              onClick={() => onRemove(summaryId)}
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#a00",
              }}
            >
              Confirm Remove
            </button>

            <button
              type="button"
              onClick={() => setConfirmingRemove(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
