// @ts-nocheck
/*
=====================================================================
METRA — Sidebar.jsx
Stage 86.1 — Structural Mount (Hidden / Inert)
=====================================================================

Purpose:
- Structural placeholder only
- No navigation
- No state
- No handlers
- No authority surface

This component MUST remain inert at Stage 86.1.
=====================================================================
*/

export default function Sidebar() {
  return (
    <aside
      aria-hidden="true"
      style={{
        width: "0px",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Stage 86.1 — Sidebar intentionally inert */}
    </aside>
  );
}
