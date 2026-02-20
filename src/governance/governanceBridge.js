// @ts-nocheck
/*
=====================================================================
METRA — governanceBridge.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 318C — Governance Integration Bridge (Scaffold Layer)

PURPOSE
---------------------------------------------------------------------
Provide an integration boundary between:

• Governance Engine (logic layer)
• UI surfaces (Popup, Ledger, Components)

This module:

• Wraps governanceEngine functions
• Defines integration hook points
• Does NOT yet wire popup
• Does NOT yet wire ledger
• Does NOT mutate task lifecycle
• Does NOT introduce runtime behaviour changes

This is a structural preparation layer only.

=====================================================================
*/

import {
  triggerGovernanceEvent,
  recordParticipation,
  submitAdvisory,
  escalateGovernanceEvent,
  recordDecision,
} from "./governanceEngine";

/*
=====================================================================
BRIDGE — TRIGGER
=====================================================================
*/

export function bridgeTriggerGovernanceEvent(payload) {
  const event = triggerGovernanceEvent(payload);

  // Future integration hook:
  // writePopupInitiation(event);
  // writeLedgerInitiation(event);

  return event;
}

/*
=====================================================================
BRIDGE — PARTICIPATION
=====================================================================
*/

export function bridgeRecordParticipation(payload) {
  const event = recordParticipation(payload);

  // Future integration hook:
  // writePopupParticipation(event);

  return event;
}

/*
=====================================================================
BRIDGE — ADVISORY
=====================================================================
*/

export function bridgeSubmitAdvisory(payload) {
  const event = submitAdvisory(payload);

  // Future integration hook:
  // writePopupAdvisory(event);
  // linkAdvisoryArtefact(event);

  return event;
}

/*
=====================================================================
BRIDGE — ESCALATION
=====================================================================
*/

export function bridgeEscalateGovernanceEvent(payload) {
  const event = escalateGovernanceEvent(payload);

  // Future integration hook:
  // writePopupEscalation(event);
  // updateLedgerEscalation(event);

  return event;
}

/*
=====================================================================
BRIDGE — DECISION
=====================================================================
*/

export function bridgeRecordDecision(payload) {
  const event = recordDecision(payload);

  // Future integration hook:
  // writePopupDecision(event);
  // updateLedgerDecision(event);

  return event;
}
