// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalEngagementResolver.js
Stage 500D-3HB — Constitutional Engagement Foundation

PURPOSE
-------
Bring together the constitutional engagements currently held by a
person.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Resolver performs aggregation only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no authority determination.
• Resolver performs no visibility determination.
• Resolver returns current constitutional engagements only.

This resolver establishes the constitutional foundation for
METRA World.

======================================================================
*/

import {
  repoGetPersonParticipation
} from "../personnel/SegmentPersonnelRepository";

export function resolveConstitutionalEngagements(personId) {
  if (!personId) {
    return [];
  }

  return repoGetPersonParticipation(personId).map(
    (participation) => ({
      category: "PARTICIPATION",

      source: "SegmentPersonnelRepository",

      segmentId: participation.segmentId,

      active: participation.active,

      participationType:
        participation.participationType,

      appointmentId:
        participation.appointmentId,

      appointedOn:
        participation.appointedOn,

      payload: participation
    })
  );
}

export default resolveConstitutionalEngagements;
