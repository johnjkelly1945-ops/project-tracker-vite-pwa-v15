// @ts-nocheck
/*
=====================================================================
METRA — TaskSurface.jsx
Stage 399G — Minimal Surface Container (Canonical Fix)
=====================================================================

Purpose:
Provide a safe container for task rendering.

Rules:
• No logic
• No lifecycle
• No styling assumptions
• NO DOM INTERFERENCE
• Pure passthrough of children

=====================================================================
*/

export default function TaskSurface({ children }) {
  return <>{children}</>;
}
