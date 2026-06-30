// @ts-nocheck
/*
=====================================================================
METRA — resolveSegmentAuthority.js
Stage 500E-1A — Constitutional Stewardship Evidence
=====================================================================

PURPOSE
-------
Derive constitutional stewardship evidence for an actor within a
segment.

CONSTITUTIONAL RULES
--------------------
• Repository owns constitutional facts.
• Context owns stewardship appointments.
• Resolver derives stewardship evidence only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver has no UI knowledge.

=====================================================================
*/

export function resolveSegmentAuthority(segment, actor) {
  if (!segment || !actor) {
    return {
      isController: false,
      isPM: false
    };
  }

  const isController = segment.createdBy === actor.id;

  const isPM =
    segment.pmId === actor.id ||
    (segment.pmId == null && isController);

  return {
    isController,
    isPM
  };
}
