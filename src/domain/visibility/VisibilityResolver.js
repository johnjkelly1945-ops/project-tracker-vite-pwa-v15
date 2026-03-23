// @ts-nocheck
/*
=====================================================================
METRA — VisibilityResolver.js
Stage 420 — Visibility Layer (Corrected)
=====================================================================
*/

const SURFACES = {
  TASK_NOTES: "TASK_NOTES"
};

export function canViewSurface({ actor, surface, context }) {
  if (!actor) return false;

  const { task } = context || {};

  switch (surface) {
    case SURFACES.TASK_NOTES: {
      if (!task) return false;

      const isPM = actor.role === "PM";
      const isAssignee = task?.assigneeId === actor.id;

      if (isPM || isAssignee) {
        return true;
      }

      return false;
    }

    default:
      return false;
  }
}
