// @ts-nocheck
/*
=====================================================================
METRA — governanceBridge.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 318C — Governance Integration Bridge (Scaffold Layer)
Stage 371C — Advisory Artefact Linkage
Stage 371C.1 — Artefact Duplication Safeguard
Stage 371C.2 — Event Type Normalisation

=====================================================================
*/

import {
  triggerGovernanceEvent,
  recordParticipation,
  submitAdvisory,
  escalateGovernanceEvent,
  recordDecision,
} from "./governanceEngine";

import {
  createGovernanceArtefact,
  getArtefactsByTask,
} from "../domain/governance/GovernanceArtefacts";

/*
=====================================================================
BRIDGE — TRIGGER
=====================================================================
*/

export function bridgeTriggerGovernanceEvent(payload) {
  const event = triggerGovernanceEvent(payload);
  return event;
}

/*
=====================================================================
BRIDGE — PARTICIPATION
=====================================================================
*/

export function bridgeRecordParticipation(payload) {
  const event = recordParticipation(payload);
  return event;
}

/*
=====================================================================
BRIDGE — ADVISORY
=====================================================================
*/

export function bridgeSubmitAdvisory(payload) {
  const event = submitAdvisory(payload);

  /*
  ==============================================================
  STAGE 371 — ARTEFACT LINKAGE
  ==============================================================

  Rule:
  One governance event → one artefact
  */

  const { eventId, taskId } = event;
  const eventType = event.eventType?.toUpperCase();

  const advisory = event.advisoryRecords[event.advisoryRecords.length - 1];

  if (advisory && !advisory.artefactId) {

    const existingArtefacts = getArtefactsByTask(taskId);
    const artefactAlreadyExists =
      existingArtefacts.find(a => a.eventId === eventId);

    if (!artefactAlreadyExists) {

      let artefactType = null;

      if (eventType === "RISK") artefactType = "risk";
      if (eventType === "ISSUE") artefactType = "issue";
      if (eventType === "QC") artefactType = "qc";
      if (eventType === "CHANGE") artefactType = "change";

      if (artefactType) {
        createGovernanceArtefact({
          type: artefactType,
          eventId,
          taskId,
        });
      }

    }
  }

  return event;
}

/*
=====================================================================
BRIDGE — ESCALATION
=====================================================================
*/

export function bridgeEscalateGovernanceEvent(payload) {
  const event = escalateGovernanceEvent(payload);
  return event;
}

/*
=====================================================================
BRIDGE — DECISION
=====================================================================
*/

export function bridgeRecordDecision(payload) {
  const event = recordDecision(payload);
  return event;
}
