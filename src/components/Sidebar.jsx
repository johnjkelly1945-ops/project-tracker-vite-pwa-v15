// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
Stage 86.2 — Explicit Expand / Collapse (Visual Only)
=====================================================================

Rules:
- Visual state only (expanded / collapsed)
- No navigation
- No routing
- No task / summary / popup context
- Out-of-layout-flow at all times
- Default collapsed
=====================================================================
*/

import { useState } from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const SIDEBAR_WIDTH = 260; // visual only, no layout coupling

  return (
    <aside
      aria-hidden={!expanded}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: expanded ? `${SIDEBAR_WIDTH}px` : "0px",
        overflow: "hidden",
        background: "#f7f7f7",
        borderRight: expanded ? "1px solid #ddd" : "none",
        pointerEvents: expanded ? "auto" : "none",
        transition: "width 0.2s ease",
        zIndex: 1000,
      }}
    >
      {/* Collapsed affordance (always visible) */}
      <button
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={() => setExpanded((v) => !v)}
        style={{
          position: "absolute",
          top: "16px",
          right: expanded ? "8px" : "-28px",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        {expanded ? "‹" : "›"}
      </button>

      {/* Expanded content placeholder — inert */}
      {expanded && (
        <div style={{ padding: "16px" }}>
          <strong>Sidebar</strong>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            Stage 86.2 — visual only
          </p>
        </div>
      )}
    </aside>
  );
}
