// @ts-nocheck
/*
=====================================================================
METRA — SubordinateSelectionModal.jsx
Stage 246 — Subordinate Selection Modal (Portal)
---------------------------------------------------------------------
Purpose:
• Selection-only surface
• Subordinate to TaskPopup footer
• Rendered via React Portal
• Non-mutating
• No assignment, no commit, no side effects
• No routing, no authority
=====================================================================
*/

import React from "react";
import { createPortal } from "react-dom";

export default function SubordinateSelectionModal({
  title = "Select Item",
  items = [],
  onSelect,
  onClose,
}) {
  return createPortal(
    <div
      className="subordinate-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 11000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="subordinate-modal-window"
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          width: "420px",
          maxWidth: "90vw",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          className="subordinate-modal-header"
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close selection modal"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="subordinate-modal-body"
          style={{
            padding: "12px",
            overflowY: "auto",
          }}
        >
          {items.length === 0 && (
            <div
              className="subordinate-modal-empty"
              style={{ color: "#666", fontStyle: "italic" }}
            >
              No items available
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="subordinate-modal-item"
              onClick={() => onSelect(item)}
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              {item.displayName || item.title || String(item)}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
