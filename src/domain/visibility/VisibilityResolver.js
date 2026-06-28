// @ts-nocheck
/*
=====================================================================
METRA — VisibilityResolver.js
Stage 500D-3HC — Constitutional Visibility Projection
=====================================================================

PURPOSE
-------
Project constitutional visibility to the UI.

CONSTITUTIONAL RULES
--------------------
• Resolver performs projection only.
• Resolver derives no constitutional policy.
• Resolver consumes constitutional visibility.
• Resolver performs no repository access.
• Resolver performs no mutation.
• Resolver has no UI knowledge.

=====================================================================
*/

import {
  resolveEffectiveObservation
} from "../observation/EffectiveObservationResolver";

import {
  resolveObservationVisibility,
  VISIBILITY_SURFACES
} from "./ObservationVisibilityResolver";

const SURFACES = {
  TASK_NOTES: "TASK_NOTES",

  SIDEBAR_GOVERNANCE:
    VISIBILITY_SURFACES.SIDEBAR_GOVERNANCE,

  SIDEBAR_CHANGE:
    VISIBILITY_SURFACES.SIDEBAR_CHANGE,

  SIDEBAR_RISKS:
    VISIBILITY_SURFACES.SIDEBAR_RISKS,

  SIDEBAR_ISSUES:
    VISIBILITY_SURFACES.SIDEBAR_ISSUES,

  SIDEBAR_QC:
    VISIBILITY_SURFACES.SIDEBAR_QC,

  SIDEBAR_ESCALATION:
    VISIBILITY_SURFACES.SIDEBAR_ESCALATION,

  SIDEBAR_DOCUMENTS:
    VISIBILITY_SURFACES.SIDEBAR_DOCUMENTS,

  SIDEBAR_DASHBOARD:
    VISIBILITY_SURFACES.SIDEBAR_DASHBOARD
};

function canViewSidebarSurface(
  actor,
  surface,
  context
) {
  const { segmentId } = context || {};

  const observation =
    resolveEffectiveObservation({
      actor,
      segmentId
    });

  const visibility =
    resolveObservationVisibility(observation);

  return visibility[surface] === true;
}

export function canViewSurface({
  actor,
  surface,
  context
}) {
  if (!actor) return false;

  const { task } = context || {};

  switch (surface) {

    case SURFACES.TASK_NOTES: {
      if (!task) return false;

      return (
        actor.role === "PM" ||
        task.assigneeId === actor.id
      );
    }

    case SURFACES.SIDEBAR_GOVERNANCE:
    case SURFACES.SIDEBAR_CHANGE:
    case SURFACES.SIDEBAR_RISKS:
    case SURFACES.SIDEBAR_ISSUES:
    case SURFACES.SIDEBAR_QC:
    case SURFACES.SIDEBAR_ESCALATION:
    case SURFACES.SIDEBAR_DOCUMENTS:
    case SURFACES.SIDEBAR_DASHBOARD:

      return canViewSidebarSurface(
        actor,
        surface,
        context
      );

    default:
      return false;
  }
}

