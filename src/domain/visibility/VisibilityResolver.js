// @ts-nocheck
/*
=====================================================================
METRA — VisibilityResolver.js
Stage 420 — Visibility Layer (Corrected)
=====================================================================
*/

const SURFACES = {
  TASK_NOTES: "TASK_NOTES",
  SIDEBAR_GOVERNANCE: "SIDEBAR_GOVERNANCE",
  SIDEBAR_ESCALATION: "SIDEBAR_ESCALATION",
  SIDEBAR_DOCUMENTS: "SIDEBAR_DOCUMENTS",
  SIDEBAR_DASHBOARD: "SIDEBAR_DASHBOARD"
};
function canViewSidebarSurface(actor, context) {
  const { segmentId } = context || {};

  return Boolean(actor);
}


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
      case SURFACES.SIDEBAR_GOVERNANCE:
      case SURFACES.SIDEBAR_ESCALATION:
      case SURFACES.SIDEBAR_DOCUMENTS:
      case SURFACES.SIDEBAR_DASHBOARD: {
        return canViewSidebarSurface(actor, context);
      }


    default:
      return false;
  }
}
