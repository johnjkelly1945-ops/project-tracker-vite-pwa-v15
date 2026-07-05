// @ts-nocheck
/*
======================================================================

METRA — AdvisoryNavigationResolver.js
Stage 500H-8A — Advisory Navigation Projection

PURPOSE
-------
Resolve the governance events for which an actor has
advisory engagement on a task.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Resolver derives advisory navigation only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no UI navigation.
• Resolver has no UI knowledge.

======================================================================
*/

import { getGovernanceEventsByTask }
  from "../../governance/governanceStore";

export function resolveAdvisoryNavigation({
  actor,
  taskId
}) {
  if (!actor || !taskId) {
    return [];
  }

  return (getGovernanceEventsByTask(taskId) || []).filter(
    (event) =>
      Array.isArray(event.participation) &&
      event.participation.some(
        (p) => p && p.reviewerId === actor.id
      )
  );
}

export default resolveAdvisoryNavigation;
