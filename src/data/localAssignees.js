// @ts-nocheck
/*
=====================================================================
METRA — localAssignees.js
Stage 148 — Gate G3 Assignee Source (Local, Static)
Stage 151A — Dev-time Current User Bridge (Non-Authoritative)
=====================================================================

ROLE
---------------------------------------------------------------------
Minimal, local assignee identifiers for Gate G3 assignment.

Includes a development-time "current-user" entry to allow
verification of assignee-only execution start (Stage 151A).

This is NOT an identity system.
This entry is replaceable by a future gate.

CONSTRAINTS
---------------------------------------------------------------------
• Static data only
• Identification only
• No roles
• No permissions
• No acceptance semantics
=====================================================================
*/

export const localAssignees = [
  { id: "current-user", displayName: "Me", type: "dev" },

  { id: "entity-001", displayName: "Internal Team A", type: "entity" },
  { id: "person-001", displayName: "Jane Smith", type: "person" },
  { id: "person-002", displayName: "John Doe", type: "person" },
];
