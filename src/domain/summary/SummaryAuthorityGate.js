/*
=====================================================================
METRA — SummaryAuthorityGate
Stage 35 — Summary Shell Persistence (Existence-Only)
=====================================================================

PURPOSE
---------------------------------------------------------------------
Determine whether a summary creation intent may be honoured.

This gate:
• DOES evaluate authority
• DOES return a boolean decision
• DOES NOT create summaries
• DOES NOT persist anything
• DOES NOT touch UI or render logic
• DOES NOT throw errors (fail-closed)

SEM-SAFE:
• SEM-12 — Authority vs Attribution
• SEM-17 — Fail-Closed Enforcement

=====================================================================
*/

/**
 * Determine if the actor is authorised to create a summary.
 *
 * Stage 35 rule:
 * - ONLY the Workspace Owner may honour summary creation intent.
 *
 * @param {Object} params
 * @param {string} params.actorId          - Current actor identifier
 * @param {string} params.workspaceOwnerId - Workspace owner identifier
 *
 * @returns {boolean} authorised
 */
export function canCreateSummary({ actorId, workspaceOwnerId }) {
  if (!actorId || !workspaceOwnerId) {
    // Fail-closed: missing context denies authority
    return false;
  }

  return actorId === workspaceOwnerId;
}
