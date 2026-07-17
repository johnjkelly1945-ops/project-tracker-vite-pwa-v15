// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalEngagementProjectionResolver.js
Stage 500M-2 — Constitutional Engagement Projection Foundation

PURPOSE
-------
Produce the current Constitutional Engagement projection from
completed constitutional projections.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Resolver consumes completed constitutional projections.
• Resolver performs projection only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no repository access.
• Resolver performs no authority determination.
• Resolver returns the current Constitutional Engagement.

This stage introduces the constitutional destination only.

No existing execution pipeline is modified.

======================================================================
*/

import {
  assembleConstitutionalEngagement
} from "./ConstitutionalEngagementAssembly";

export function resolveConstitutionalEngagementProjection({

  appointment = null,

  responsibilities = [],

  participation = []

}) {

  return assembleConstitutionalEngagement({

    appointment,

    responsibilities,

    participation

  });

}

export default resolveConstitutionalEngagementProjection;
