// @ts-nocheck
/*
=====================================================================
METRA — GovernanceEventRecorder.js
Stage 417 — Governance Ledger Integration (Bridge Layer)
=====================================================================

Purpose
---------------------------------------------------------------------
Records governance events by bridging domain actions to the ledger.

Rules
---------------------------------------------------------------------
• No UI logic
• No domain mutation
• No authority logic
• Delegates to:
  - GovernanceEvent (event creation)
  - GovernanceLedger (append-only store)

=====================================================================
*/

import { createGovernanceEvent } from "./GovernanceEvent";
import { appendEvent } from "./GovernanceLedger";


/*
---------------------------------------------------------------------
RECORD GOVERNANCE EVENT
---------------------------------------------------------------------

Input:
{
  type,
  actor,
  target,
  metadata
}

Behaviour:
• Creates canonical event
• Appends to ledger
---------------------------------------------------------------------
*/

export function recordGovernanceEvent({
  type,
  actor,
  target,
  metadata = {}
}) {
  const event = createGovernanceEvent({
    type,
    actor,
    target,
    metadata
  });

  appendEvent(event);

  return event;
}

