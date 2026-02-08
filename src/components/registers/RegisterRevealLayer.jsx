// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 279 — Governance Registers — Global Reveal Layer (INERT)

PURPOSE
---------------------------------------------------------------------
Provide a global, inspection-only overlay layer mounted via a DOM
portal outside the React workspace tree.

This implementation is intentionally INERT:
• Hidden by default
• No event listeners
• No props
• No wiring
• No side effects

AUTHORITATIVE CONSTRAINTS
---------------------------------------------------------------------
• UI-only
• Additive only
• Fully removable
• No workspace awareness
• No sidebar awareness
• SEM-NR-01 preserved
=====================================================================
*/

import { createPortal } from "react-dom";

export default function RegisterRevealLayer() {
  const host = document.getElementById("metra-register-reveal");
  if (!host) return null;

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        display: "none",
      }}
    />,
    host
  );
}
