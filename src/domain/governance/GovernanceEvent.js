// @ts-nocheck
/*
=====================================================================
METRA — GovernanceEvent.js
Stage 417 — Governance Ledger Integration (Event Model)
=====================================================================

Purpose
---------------------------------------------------------------------
Defines the canonical governance event structure and event types.

Rules
---------------------------------------------------------------------
• Pure domain construct
• No UI logic
• No storage logic
• No authority logic
• Append-only compatibility

=====================================================================
*/


/*
---------------------------------------------------------------------
EVENT TYPES (LOCKED — Stage 417 Scope)
---------------------------------------------------------------------
*/

export const GOVERNANCE_EVENT_TYPES = {
  PERSON_CREATED: "PERSON_CREATED",
  PERSON_UPDATED: "PERSON_UPDATED",
  ROLE_ASSIGNED: "ROLE_ASSIGNED"
};


/*
---------------------------------------------------------------------
UTILITY — Timestamp
---------------------------------------------------------------------
*/

function nowTimestamp() {
  return new Date().toISOString();
}


/*
---------------------------------------------------------------------
UTILITY — Event ID Generator
---------------------------------------------------------------------
*/

function generateEventId() {
  return "evt_" + Math.random().toString(36).substring(2, 10);
}


/*
---------------------------------------------------------------------
CREATE GOVERNANCE EVENT
---------------------------------------------------------------------

Input:
{
  type,
  actor,
  target,
  metadata
}

Output:
{
  id,
  timestamp,
  type,
  actor,
  target,
  metadata
}

Rules:
• All fields required except metadata (optional)
• No mutation after creation
---------------------------------------------------------------------
*/

export function createGovernanceEvent({
  type,
  actor,
  target,
  metadata = {}
}) {
  if (!type) {
    throw new Error("GovernanceEvent: type is required");
  }

  if (!actor) {
    throw new Error("GovernanceEvent: actor is required");
  }

  if (!target) {
    throw new Error("GovernanceEvent: target is required");
  }

  return {
    id: generateEventId(),
    timestamp: nowTimestamp(),
    type,
    actor,
    target,
    metadata
  };
}

