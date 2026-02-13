// @ts-nocheck
/*
=====================================================================
METRA — governanceStore.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 318A — Governance Event Engine Foundation (Store Layer)

PURPOSE
---------------------------------------------------------------------
Provide isolated in-memory storage for Governance Events
as defined by SEM-GEV-01 v1.1.

This module:

• Does NOT mutate task lifecycle
• Does NOT write to popup
• Does NOT write to ledger
• Does NOT enforce UI behaviour
• Does NOT implement governance logic

It is a passive store only.

=====================================================================
*/

let governanceEvents = {};

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

export function createGovernanceEvent({ eventType, taskId, initiatedBy }) {
  const eventId = generateEventId();

  const event = {
    eventId,
    eventType,
    taskId,
    status: "OPEN",
    initiatedAt: Date.now(),
    initiatedBy,
    participation: [],
    advisoryRecords: [],
    decisionRecord: null,
  };

  governanceEvents[eventId] = event;

  return event;
}

/*
=====================================================================
GET EVENT
=====================================================================
*/

export function getGovernanceEvent(eventId) {
  return governanceEvents[eventId] || null;
}

/*
=====================================================================
GET EVENTS BY TASK
=====================================================================
*/

export function getGovernanceEventsByTask(taskId) {
  return Object.values(governanceEvents).filter(
    (event) => event.taskId === taskId
  );
}

/*
=====================================================================
UPDATE EVENT (Controlled Internal Use Only)
=====================================================================
*/

export function updateGovernanceEvent(eventId, updatedEvent) {
  if (!governanceEvents[eventId]) return null;

  governanceEvents[eventId] = updatedEvent;
  return governanceEvents[eventId];
}

/*
=====================================================================
STORE RESET (TESTING ONLY — NOT FOR PRODUCTION USE)
=====================================================================
*/

export function __resetGovernanceStore() {
  governanceEvents = {};
}

