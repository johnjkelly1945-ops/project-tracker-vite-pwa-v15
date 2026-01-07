// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
Stage 86.3 — Read-Only Navigation (Overview Mode)
FINAL VISIBILITY & CONTRAST FIX
=====================================================================
*/

import { useState } from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const SIDEBAR_WIDTH = 260;
  const HANDLE_WIDTH = 32;

  function blockInteraction(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <aside
      aria-hidden={!expanded}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: expanded ? `${SIDEBAR_WIDTH}px` : `${HANDLE_WIDTH}px`,
        background: expanded ? "#f7f7f7" : "#ffffff",
        borderRight: "2px solid #000",   // HIGH CONTRAST EDGE
        zIndex: 9999,                    // ABOVE MODAL OVERLAY
        transition: "width 0.2s ease",
      }}
    >
      {/* Expand / Collapse handle — deliberately high contrast */}
      <button
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={() => setExpanded((v) => !v)}
        style={{
          position: "absolute",
          top: "50%",
          left: "4px",
          transform: "translateY(-50%)",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        {expanded ? "‹" : "›"}
      </button>

      {expanded && (
        <div
          style={{ padding: "16px", marginTop: "32px" }}
          onClick={blockInteraction}
          onMouseDown={blockInteraction}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ fontSize: "14px" }}>Overview</strong>
            <div style={{ fontSize: "11px", opacity: 0.6 }}>
              Read-only
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600 }}>
              Workspace
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "6px 0" }}>
              <li style={{ opacity: 0.6, fontSize: "12px" }}>• Pre-Project</li>
              <li style={{ opacity: 0.6, fontSize: "12px" }}>• Progress</li>
            </ul>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600 }}>
              Governance
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "6px 0" }}>
              <li style={{ opacity: 0.6, fontSize: "12px" }}>• Risks</li>
              <li style={{ opacity: 0.6, fontSize: "12px" }}>• Issues</li>
              <li style={{ opacity: 0.6, fontSize: "12px" }}>
                • Change Control
              </li>
            </ul>
          </div>

          <div style={{ fontSize: "11px", opacity: 0.5 }}>
            Stage 86.3 — Overview mode only
          </div>
        </div>
      )}
    </aside>
  );
}
