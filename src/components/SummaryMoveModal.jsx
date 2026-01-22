// @ts-nocheck
/*
=====================================================================
METRA — SummaryMoveModal.jsx
Stage 189 — Summary Movement (UI Surface Only)
---------------------------------------------------------------------
PHASE 1 SCOPE:
• Modal UI only
• No wiring
• No state mutation
• No footer or pane ownership
• No task logic

SEMANTIC GUARANTEES:
• One click = one intended action (to be wired later)
• Boundary intent expressed via disabled states (props)
• No removal semantics in this stage
=====================================================================
*/

import React from "react";

export default function SummaryMoveModal({
  open = false,
  summaryTitle = "",
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onClose,
}) {
  if (!open) return null;

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
          width: "360px",
          background: "#fff",
          borderRadius: "6px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          padding: "16px",
        }}
      >
        {/* ================= HEADER ================= */}
        <div style={{ marginBottom: "12px" }}>
          <strong>Move Summary</strong>
          <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
            {summaryTitle}
          </div>
        </div>

        {/* ================= CONTROLS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            style={{
              padding: "6px 10px",
              cursor: isFirst ? "not-allowed" : "pointer",
            }}
          >
            ↑ Move Up
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            style={{
              padding: "6px 10px",
              cursor: isLast ? "not-allowed" : "pointer",
            }}
          >
            ↓ Move Down
          </button>
        </div>

        {/* ================= FOOTER ================= */}
        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "6px 12px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
