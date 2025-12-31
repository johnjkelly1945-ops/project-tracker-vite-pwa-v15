/*
=====================================================================
METRA — SummaryRepository
Stage 35 — Summary Shell Persistence (Existence-Only)
=====================================================================

PURPOSE
---------------------------------------------------------------------
Persist existence-only Summary Shells in a workspace-scoped store.

This repository:
• DOES persist Summary Shells
• DOES NOT read or expose summaries
• DOES NOT render
• DOES NOT order
• DOES NOT activate
• DOES NOT link to tasks
• DOES NOT touch governance

SEM-SAFE:
• SEM-05 — Summary / Task Independence
• SEM-06 — Workspace as Authoritative Render Surface
• SEM-17 — Fail-Closed Enforcement

=====================================================================
*/

const STORAGE_KEY_PREFIX = "metra.summary.shells";

/**
 * Persist a Summary Shell (existence-only).
 *
 * @param {Object} summaryShell
 * @param {string} summaryShell.summaryId
 * @param {string} summaryShell.workspaceId
 *
 * @returns {boolean} success
 */
export function persistSummaryShell(summaryShell) {
  if (
    !summaryShell ||
    !summaryShell.summaryId ||
    !summaryShell.workspaceId
  ) {
    // Fail-closed: invalid input produces no side effects
    return false;
  }

  try {
    const storageKey = buildWorkspaceKey(summaryShell.workspaceId);
    const existing = loadWorkspaceSummaries(storageKey);

    const updated = [...existing, summaryShell];

    window.localStorage.setItem(storageKey, JSON.stringify(updated));
    return true;
  } catch {
    // Fail-closed: persistence failure is silent at this stage
    return false;
  }
}

/* ------------------------------------------------------------------
   Internal helpers (private to this module)
------------------------------------------------------------------- */

function buildWorkspaceKey(workspaceId) {
  return `${STORAGE_KEY_PREFIX}.${workspaceId}`;
}

function loadWorkspaceSummaries(storageKey) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
