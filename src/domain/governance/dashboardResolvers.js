// @ts-nocheck
/*
=====================================================================
METRA — dashboardResolvers.js
Stage 479A — Governance Visibility Resolver (Minimal Safe Pass)
=====================================================================

PURPOSE
---------------------------------------------------------------------
Provide projection-only governance visibility resolvers for
Governance Dashboard observability surfaces.

Resolvers:
• are stateless
• are deterministic
• are read-only
• do not mutate governance lifecycle
• do not persist derived state
• do not interpret governance meaning

Dashboard visibility is:
• observational
• consultative
• awareness-oriented
• non-authoritative

=====================================================================
*/

import { repoGetAll } from "./GovernanceRepository";


export function resolveOpenGovernanceCounts() {
  const events = repoGetAll();

  const counts = {
    ISSUE: 0,
    RISK: 0,
    QC: 0,
    CC: 0,
    ESCALATION: 0,
  };

  events.forEach((event) => {
    if (event.status !== "OPEN") return;

    if (counts[event.eventType] !== undefined) {
      counts[event.eventType] += 1;
    }
  });

  return counts;
}
