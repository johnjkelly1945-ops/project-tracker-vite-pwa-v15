// @ts-nocheck
/*
======================================================================

METRA — ObservationVisibilityResolver.js
Stage 500D-3HC — Observation Visibility Foundation

PURPOSE
-------
Convert effective constitutional observation into visible
constitutional UI surfaces.

CONSTITUTIONAL RULES
--------------------
• Resolver consumes effective observation only.
• Resolver derives visible constitutional surfaces.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no repository access.
• Resolver performs no authority determination.
• Resolver has no UI knowledge.

======================================================================
*/

export const VISIBILITY_SURFACES = Object.freeze({

  SIDEBAR_GOVERNANCE: "SIDEBAR_GOVERNANCE",

  SIDEBAR_CHANGE: "SIDEBAR_CHANGE",

  SIDEBAR_RISKS: "SIDEBAR_RISKS",

  SIDEBAR_ISSUES: "SIDEBAR_ISSUES",

  SIDEBAR_QC: "SIDEBAR_QC",

  SIDEBAR_ESCALATION: "SIDEBAR_ESCALATION",

  SIDEBAR_DOCUMENTS: "SIDEBAR_DOCUMENTS",

  SIDEBAR_DASHBOARD: "SIDEBAR_DASHBOARD"

});

export function resolveObservationVisibility(
  observation = {}
) {
  return {

    [VISIBILITY_SURFACES.SIDEBAR_GOVERNANCE]:
      !!(
        observation.change ||
        observation.risks ||
        observation.issues ||
        observation.qc ||
        observation.escalation
      ),

    [VISIBILITY_SURFACES.SIDEBAR_CHANGE]:
      !!observation.change,

    [VISIBILITY_SURFACES.SIDEBAR_RISKS]:
      !!observation.risks,

    [VISIBILITY_SURFACES.SIDEBAR_ISSUES]:
      !!observation.issues,

    [VISIBILITY_SURFACES.SIDEBAR_QC]:
      !!observation.qc,

    [VISIBILITY_SURFACES.SIDEBAR_ESCALATION]:
      !!observation.escalation,

    /*
     Stage 500
     ----------
     Documents and Dashboard remain globally
     visible until constitutional policy is
     introduced.
    */

    [VISIBILITY_SURFACES.SIDEBAR_DOCUMENTS]:
      true,

    [VISIBILITY_SURFACES.SIDEBAR_DASHBOARD]:
      true
  };
}

export default resolveObservationVisibility;
