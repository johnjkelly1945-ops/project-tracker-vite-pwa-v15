// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalWorkspaceRouter.js
Stage 500L-3A — Constitutional Router Semantic Alignment

PURPOSE
-------
Determine the constitutional destination following
constitutional actor selection.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Constitutional Engagement Resolver owns engagement aggregation.
• Constitutional Router owns constitutional destination routing.
• Router performs routing determination only.
• Router performs no mutation.
• Router performs no rendering.
• Router performs no UI navigation.
• Router returns constitutional destinations only.

======================================================================
*/

import { resolveOperationalAuthority }
  from "../operation/OperationalAuthorityResolver";

import { resolveAdvisoryNavigation }
  from "../governance/AdvisoryNavigationResolver";

export const CONSTITUTIONAL_WORKSPACE = Object.freeze({
  OPERATIONAL: "OPERATIONAL",
  PARTICIPATION: "PARTICIPATION",
  ADVISORY: "ADVISORY"
});

export function resolveConstitutionalWorkspace({
  actor,
  segment,
  task
}) {
  const { isOperational } =
    resolveOperationalAuthority({
      actor,
      segment,
      task
    });

  const advisoryNavigation =
    resolveAdvisoryNavigation({
      actor,
      taskId: task?.id
    });

  const hasAdvisoryWorkspace =
    advisoryNavigation.length > 0;

  if (isOperational) {
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.OPERATIONAL
    };
  }

  if (hasAdvisoryWorkspace) {
    return {
      destination:
        CONSTITUTIONAL_WORKSPACE.ADVISORY
    };
  }

  return {
    destination:
      CONSTITUTIONAL_WORKSPACE.OPERATIONAL
  };
}

export default resolveConstitutionalWorkspace;
