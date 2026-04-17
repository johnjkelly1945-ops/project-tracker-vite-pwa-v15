import { getActingUser } from "../domain/actor/ActingUser";
// @ts-nocheck
/*
=====================================================================
METRA — governanceEngine.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 318B — Governance Event Engine (Logic Layer)

PURPOSE
---------------------------------------------------------------------
Provide governance transaction logic in accordance with:

SEM-GEV-01 v1.1 — Governance Event Base Canon

This module:

• Wraps governanceStore
• Enforces participation discipline
• Enforces decision discipline
• Preserves open-state rule
• Preserves immutability principles

This module does NOT:

• Write to popup
• Write to ledger
• Mutate task lifecycle
• Implement UI behaviour

=====================================================================
*/

import {
  createGovernanceEvent,
  getGovernanceEvent,
  updateGovernanceEvent,
} from "./governanceStore";

/*
=====================================================================
CREATE GOVERNANCE EVENT (TRIGGER)
=====================================================================
*/

export function triggerGovernanceEvent({ eventType, taskId, initiatedBy }) {
  if (!eventType || !taskId || !initiatedBy) {
    throw new Error("Invalid governance trigger parameters");
  }

  return createGovernanceEvent({ eventType, taskId, initiatedBy });
}

/*
=====================================================================
RECORD PARTICIPATION
=====================================================================
*/

export function recordParticipation({
  eventId,
  reviewerId,
  participationType, // "internal" | "proxy"
  acceptedBy,
}) {
  const event = getGovernanceEvent(eventId);

  if (!event) throw new Error("Governance event not found");
  if (event.status !== "OPEN")
    throw new Error("Cannot record participation on closed event");

  const participationRecord = {
    reviewerId,
    participationType,
    acceptedAt: Date.now(),
    acceptedBy,
  };

  const updatedEvent = {
    ...event,
    participation: [...(event.participation || []), participationRecord],
  };

  return updateGovernanceEvent(eventId, updatedEvent);
}

/*
=====================================================================
SUBMIT ADVISORY
=====================================================================
*/

export function submitAdvisory({
  eventId,
  submittedBy,
  summary,
  artefactId = null,
  templateId = null,
}) {
  const event = getGovernanceEvent(eventId);

  if (!event) throw new Error("Governance event not found");
  if (event.status !== "OPEN")
    throw new Error("Cannot submit advisory on closed event");

  if (!event.participation.length)
    throw new Error("Participation must be recorded before advisory");


  const actor = getActingUser();


const advisoryRecord = {
advisoryId: `adv_${Date.now()}`,
submittedBy,
submittedAt: Date.now(),
summary: `[${actor?.displayName || submittedBy}] ${summary}`,
submittedByName: actor?.displayName || "Unknown",
artefactId,
templateId,
};

  const existingAdvisories = Array.isArray(event.advisoryRecords)
    ? event.advisoryRecords
    : [];

  const updatedEvent = {
    ...event,
    advisoryRecords: [...existingAdvisories, advisoryRecord],
  };

  return updateGovernanceEvent(eventId, updatedEvent);
}

/*
=====================================================================
ESCALATE GOVERNANCE EVENT
=====================================================================
*/

export function escalateGovernanceEvent({ eventId }) {
  const event = getGovernanceEvent(eventId);

  if (!event) throw new Error("Governance event not found");

  // Immutable: only escalate once
  if (event.escalated === true) {
    return event;
  }

  const updatedEvent = {
    ...event,
    escalated: true,
  };

  return updateGovernanceEvent(eventId, updatedEvent);
}

/*
=====================================================================
RECORD DECISION
=====================================================================
*/

export function recordDecision({ eventId, decision, decidedBy }) {
  const event = getGovernanceEvent(eventId);

  if (!event) throw new Error("Governance event not found");
  if (event.status !== "OPEN")
    throw new Error("Event already closed");

  const updatedEvent = {
    ...event,
    status: "CLOSED",
    decisionRecord: {
      decision,
      decidedBy,
      decidedAt: Date.now(),
    },
  };

  return updateGovernanceEvent(eventId, updatedEvent);
}
