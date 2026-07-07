// @ts-nocheck
/*
======================================================================

METRA — ConstitutionalWorkspaceRouter.js
Stage 500H-7D-A — Constitutional Experience Routing Foundation

PURPOSE
-------
Determine the constitutional experience entered following
task selection.

CONSTITUTIONAL RULES
--------------------
• Repository remains the single source of truth.
• Constitutional Engagement Resolver owns engagement aggregation.
• Constitutional Experience Router owns experience routing.
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

  return {
    destination:
      CONSTITUTIONAL_WORKSPACE.OPERATIONAL
  };
}

export default resolveConstitutionalWorkspace;
