// @ts-nocheck
/*
=====================================================================
METRA — governanceStore.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 323 — Governance Domain Persistence (Repository Adapter)

PURPOSE
---------------------------------------------------------------------
Delegate Governance Event storage to GovernanceRepository
while preserving existing store API surface.

This module:

• Preserves engine contract
• Preserves function signatures
• Does NOT mutate task lifecycle
• Does NOT bind to UI
• Does NOT enforce governance logic

It is now a thin adapter over GovernanceRepository.

=====================================================================
*/

import {
  repoCreate,
  repoGet,
  repoGetByTask,
  repoUpdate,
  repoReset,
} from "../domain/governance/GovernanceRepository";

/*
=====================================================================
UTILITY — ID GENERATION
=====================================================================
*/

function generateEventId() {
  return `gev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/*
=====================================================================
CREATE EVENT
=====================================================================
*/

export function createGovernanceEvent({ eventType, taskId, initiatedBy, artefactId = null, segmentId = null }) {

  // 🔒 Enforce 1 artefact → 1 event
  const existing = repoGetByTask(taskId)
    .find(e =>
      e.eventType === eventType &&
      e.artefactId === artefactId
    );

  if (existing) return existing;

  const eventId = generateEventId();

  const event = {
    eventId,
    eventType,
    taskId,
    artefactId,
      segmentId,
    status: "OPEN",
    closedAt: null,
    closedBy: null,
    escalated: false,
    initiatedAt: Date.now(),
    initiatedBy,
    participation: [],
    advisoryRecords: [],
    decisionRecord: null,
  };

  return repoCreate(event);
}

/*
=====================================================================
GET EVENT
=====================================================================
*/

export function getGovernanceEvent(eventId) {
  return repoGet(eventId);
}

/*
=====================================================================
GET EVENTS BY TASK
=====================================================================
*/

export function getGovernanceEventsByTask(taskId) {
  return repoGetByTask(taskId);
}

/*
=====================================================================
UPDATE EVENT
=====================================================================
*/

export function updateGovernanceEvent(eventId, updatedEvent) {
  return repoUpdate(eventId, updatedEvent);
}

/*
=====================================================================
STORE RESET (TESTING ONLY)
=====================================================================
*/

export function __resetGovernanceStore() {
  return repoReset();
}
