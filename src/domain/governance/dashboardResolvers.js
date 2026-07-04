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
import { getAllEscalations } from "../escalation/EscalationStore";


export function resolveOpenGovernanceCounts(segmentId) {
  const events = repoGetAll().filter(
    (event) => event.segmentId === segmentId
  );
  const escalations =
    getAllEscalations().filter(
      (e) =>
        e.segmentId === segmentId &&
        e.status === "OPEN" &&
        Array.isArray(e.participation) &&
        e.participation.length > 0
    );

  const counts = {
    ISSUE: 0,
    RISK: 0,
    QC: 0,
    CC: 0,
    INTERNAL_ESCALATION: 0,
    EXTERNAL_ESCALATION: 0,
  };

  events.forEach((event) => {
    if (event.status !== "OPEN") return;

    if (counts[event.eventType] !== undefined) {
      counts[event.eventType] += 1;
    }
  });

  escalations.forEach((esc) => {
    if (esc.visibilityScope === "EXTERNAL") {
      counts.EXTERNAL_ESCALATION += 1;
    } else {
      counts.INTERNAL_ESCALATION += 1;
    }
  });

  return counts;
}
