// @ts-nocheck
/*
======================================================================

METRA — EffectiveObservationResolver.js
Stage 500D-3HB — Effective Observation Foundation

PURPOSE
-------
Derive the effective governance observation available to an actor
within a segment.

CONSTITUTIONAL RULES
--------------------
• Authority and Participation are orthogonal.
• Authority may contribute observation.
• Participation contributes bounded observation.
• Effective observation is the union of Authority and Participation.
• Resolver derives observation only.
• Resolver performs no mutation.
• Resolver performs no rendering.
• Resolver has no UI knowledge.

======================================================================
*/

import {
  resolveConstitutionalEngagements
} from "../constitutional/ConstitutionalEngagementResolver";

import { PARTICIPATION_TYPES }
  from "../personnel/PersonnelParticipationTypes";

const PARTICIPATION_TO_OBSERVATION = Object.freeze({
  [PARTICIPATION_TYPES.RISK_INSPECTION]: "risks",
  [PARTICIPATION_TYPES.ISSUE_INSPECTION]: "issues",
  [PARTICIPATION_TYPES.QC_INSPECTION]: "qc",
  [PARTICIPATION_TYPES.CC_INSPECTION]: "change",
  [PARTICIPATION_TYPES.ESCALATION_INSPECTION]: "escalation"
});

function emptyObservation() {
  return {
    change: false,
    risks: false,
    issues: false,
    qc: false,
    escalation: false
  };
}

export function resolveEffectiveObservation({
  actor,
  segmentId
}) {
  const observation = emptyObservation();

  if (!actor || !segmentId) {
    return observation;
  }

  resolveConstitutionalEngagements(actor.id)
    .filter(
      (e) =>
        e.category === "PARTICIPATION" &&
        e.segmentId === segmentId
    )
    .forEach((e) => {
      const surface =
        PARTICIPATION_TO_OBSERVATION[
          e.participationType
        ];

      if (surface) {
        observation[surface] = true;
      }
    });

  return observation;
}

export default resolveEffectiveObservation;
