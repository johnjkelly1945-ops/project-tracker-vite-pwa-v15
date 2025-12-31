/*
=====================================================================
METRA — SummaryShellFactory
Stage 35 — Summary Shell Persistence (Existence-Only)
=====================================================================

PURPOSE
---------------------------------------------------------------------
Create an in-memory Summary Shell that asserts existence only.

This factory:
• DOES create an object
• DOES NOT persist
• DOES NOT render
• DOES NOT order
• DOES NOT link to tasks
• DOES NOT imply activation or governance

SEM-SAFE:
• SEM-05 — Summary / Task Independence
• SEM-12 — Authority vs Attribution
• SEM-17 — Fail-Closed (no side effects)

=====================================================================
*/

/**
 * Create a Summary Shell (existence-only entity)
 *
 * @param {Object} params
 * @param {string} params.workspaceId   - Workspace scope anchor
 * @param {string} params.createdBy     - Authority attribution (e.g. workspace owner id)
 * @param {string} [params.intentId]    - Optional traceability to intent
 *
 * @returns {Object} SummaryShell
 */
export function createSummaryShell({ workspaceId, createdBy, intentId }) {
  if (!workspaceId || !createdBy) {
    // Fail-closed: invalid input creates nothing
    return null;
  }

  const summaryShell = {
    summaryId: generateSummaryId(),
    workspaceId,
    createdAt: new Date().toISOString(),
    createdBy,
  };

  if (intentId) {
    summaryShell.intentId = intentId;
  }

  return summaryShell;
}

/* ------------------------------------------------------------------
   Internal helpers (private to this module)
------------------------------------------------------------------- */

/**
 * Generate an opaque summary identifier.
 * Implementation detail intentionally simple and replaceable.
 */
function generateSummaryId() {
  return `summary_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
