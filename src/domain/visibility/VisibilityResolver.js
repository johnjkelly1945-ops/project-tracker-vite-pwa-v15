// @ts-nocheck
/*
=====================================================================
METRA — VisibilityResolver.js
Stage 420 — Visibility Layer (Corrected)
=====================================================================
*/

import { resolveRelatedSegmentIds } from "../relationships/RelationshipResolver";
const SURFACES = {
  TASK_NOTES: "TASK_NOTES",

  // Aggregate governance surface
  SIDEBAR_GOVERNANCE: "SIDEBAR_GOVERNANCE",

  // Governance domain surfaces
  SIDEBAR_CHANGE: "SIDEBAR_CHANGE",
  SIDEBAR_RISKS: "SIDEBAR_RISKS",
  SIDEBAR_ISSUES: "SIDEBAR_ISSUES",
  SIDEBAR_QC: "SIDEBAR_QC",
  SIDEBAR_ESCALATION: "SIDEBAR_ESCALATION",

  // General observational surfaces
  SIDEBAR_DOCUMENTS: "SIDEBAR_DOCUMENTS",
  SIDEBAR_DASHBOARD: "SIDEBAR_DASHBOARD"
};
function isActorPMForSegment(actor, segment) {
  if (!actor || !segment) return false;

  return actor.role === "PM";
}


function canViewSidebarSurface(actor, context) {
  const { segmentId, segment } = context || {};

  const relatedSegmentIds =
    segmentId
      ? resolveRelatedSegmentIds(segmentId)
      : [];

  const actorGovernsSegment =
    isActorPMForSegment(actor, segment);
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
