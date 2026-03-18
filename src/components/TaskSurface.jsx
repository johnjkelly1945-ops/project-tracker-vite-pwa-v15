// @ts-nocheck
/*
=====================================================================
METRA — TaskSurface.jsx
Stage 399E — Task Surface Container (Phase 1 — Introduction Only)
=====================================================================

Purpose
---------------------------------------------------------------------
Non-invasive container for TaskPopup.

Rules

• Does NOT alter behaviour
• Does NOT introduce new logic
• Pure pass-through wrapper
• No authority, no lifecycle, no mutation

=====================================================================
*/

export default function TaskSurface({ children }) {
  return (
    <>
      {children}
    </>
  );
}
