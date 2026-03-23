// @ts-nocheck
/*
=====================================================================
METRA — GovernanceLedger.js
Stage 417 — Governance Ledger Integration (Append-Only Store)
=====================================================================

Purpose
---------------------------------------------------------------------
Append-only store for governance events.

Rules
---------------------------------------------------------------------
• Append-only (no mutation)
• No deletion
• No filtering logic
• No UI logic
• No domain coupling

=====================================================================
*/


/*
---------------------------------------------------------------------
INTERNAL EVENT STORE
---------------------------------------------------------------------
*/

const governanceEvents = [];


/*
---------------------------------------------------------------------
APPEND EVENT
---------------------------------------------------------------------

Input:
event (validated GovernanceEvent)

Rules:
• Event is appended only
• No modification allowed
---------------------------------------------------------------------
*/

export function appendEvent(event) {
  if (!event) {
    throw new Error("GovernanceLedger: event is required");
  }

  governanceEvents.push(event);
}


/*
---------------------------------------------------------------------
GET ALL EVENTS
---------------------------------------------------------------------

Returns:
Array of governance events (read-only copy)
---------------------------------------------------------------------
*/

export function getEvents() {
  return [...governanceEvents];
}

