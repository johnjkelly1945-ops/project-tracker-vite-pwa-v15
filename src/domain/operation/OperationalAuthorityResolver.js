// @ts-nocheck
/*
======================================================================

METRA — OperationalAuthorityResolver.js
Stage 500D-3HD-A — Operational Authority Foundation

PURPOSE
-------
Derive the effective operational authority available to an actor
within a segment.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Context determines constitutional appointments.
• Operational authority derives from constitutional position.
• Resolver performs derivation only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver performs no repository access.
• Resolver has no UI knowledge.

======================================================================
*/

import {
  resolveSegmentAuthority
} from "../authority/resolveSegmentAuthority";

import {
  getGovernanceEventsByTask
} from "../../governance/governanceStore";

export function resolveOperationalAuthority({
  engagement = null,
  actor,
  segment,
  task = null
}) {

  /*
  ==========================================================

  STAGE 500M MIGRATION

  Constitutional Engagement is accepted as the future
  execution contract.

  This stage preserves existing runtime behaviour.

  The current implementation continues to derive
  operational authority from the legacy inputs until
  subsequent bounded migrations replace that derivation.

  ==========================================================
  */

  const { isPM } =
    resolveSegmentAuthority(segment, actor);

  const isAssignee =
    !!(
      actor &&
      task &&
      task.assigneeId === actor.id
    );

  const events =
    task
      ? getGovernanceEventsByTask(task.id)
      : [];

  const isAdvisor =
    !!(
      actor &&
      task &&
      events.some(e =>
        Array.isArray(e.participation) &&
        e.participation.some(
          p => p.reviewerId === actor.id
        )
      )
    );

  const isOperational =
    isPM ||
    isAssignee;

  return {
    isPM,
    isAssignee,
    isAdvisor,
    isOperational
  };
}

export default resolveOperationalAuthority;
