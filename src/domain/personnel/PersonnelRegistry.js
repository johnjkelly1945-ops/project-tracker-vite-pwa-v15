/*
=====================================================================
METRA — PersonnelRegistry.js
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 255-C — Personnel Reference Pool (Read-Only)

PURPOSE
---------------------------------------------------------------------
Provide an in-memory, read-only reference pool for personnel records.

AUTHORITATIVE RULES
---------------------------------------------------------------------
• PersonnelPanel is the sole writer
• All consumers are read-only
• No persistence
• No authority logic
• No mutation APIs exposed

=====================================================================
*/

let personnel = [];

/**
 * Authoritative write — INTERNAL USE ONLY (PersonnelPanel)
 */
export function setPersonnel(next) {
  personnel = Array.isArray(next) ? [...next] : [];
}

/**
 * Read-only access for consumers
 */
export function getPersonnel() {
  return [...personnel];
}
