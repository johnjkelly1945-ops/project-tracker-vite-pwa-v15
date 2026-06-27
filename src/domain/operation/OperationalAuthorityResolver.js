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

export function resolveOperationalAuthority({
  actor,
  segment,
  task = null
}) {
  const { isPM } =
    resolveSegmentAuthority(segment, actor);

  const isAssignee =
    !!(
      actor &&
      task &&
      task.assigneeId === actor.id
    );

  const isAdvisor = false;

  const isOperational =
    isPM ||
    isAssignee ||
    isAdvisor;

  return {
    isPM,
    isAssignee,
    isAdvisor,
    isOperational
  };
}

export default resolveOperationalAuthority;
