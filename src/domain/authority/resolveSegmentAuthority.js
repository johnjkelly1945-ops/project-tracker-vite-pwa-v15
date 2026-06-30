// @ts-nocheck
/*
=====================================================================
METRA — resolveSegmentAuthority.js
Stage 500E-1B — Constitutional Stewardship Evidence
=====================================================================

PURPOSE
-------
Derive constitutional stewardship evidence for an actor within a
segment.

CONSTITUTIONAL RULES
--------------------
• Repository owns constitutional facts.
• Context owns stewardship appointments.
• Every persisted segment has a Segment Manager.
• Resolver derives stewardship evidence only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver has no UI knowledge.

=====================================================================
*/

export function resolveSegmentAuthority(segment, actor) {
  if (!segment || !actor) {
    return {
      isPM: false
    };
  }

  const isPM =
    segment.pmId === actor.id;

  return {
    isPM
  };
}
