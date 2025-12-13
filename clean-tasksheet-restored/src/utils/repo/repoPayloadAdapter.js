/* ======================================================================
   METRA – repoPayloadAdapter.js
   Stage 6.9 – Bundle & Duplicate Guardrails (Compatibility Safe)
   ----------------------------------------------------------------------
   ✔ Preserves existing adapter API
   ✔ Adds duplicate detection
   ✔ Sandbox + Component compatible
   ✔ No merge logic, no persistence
   ====================================================================== */

/* --------------------------------------------------------------
   INTERNAL HELPERS
   -------------------------------------------------------------- */
function findDuplicatesById(items = []) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (!item || !item.id) continue;

    if (seen.has(item.id)) {
      duplicates.add(item.id);
    } else {
      seen.add(item.id);
    }
  }

  return Array.from(duplicates);
}

/* --------------------------------------------------------------
   STAGE 6.9 – SANDBOX PAYLOAD ADAPTER
   -------------------------------------------------------------- */
export function adaptRepoPayload({ pane, summaries = [], tasks = [] }) {
  const safeSummaries = Array.isArray(summaries) ? summaries : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const duplicateSummaryIds = findDuplicatesById(safeSummaries);
  const duplicateTaskIds = findDuplicatesById(safeTasks);

  const hasDuplicates =
    duplicateSummaryIds.length > 0 || duplicateTaskIds.length > 0;

  const payload = {
    pane,
    summaries: safeSummaries,
    tasks: safeTasks,
    hasDuplicates,
    duplicateSummaryIds,
    duplicateTaskIds
  };

  console.log("🧩 Adapted repo summaries:", payload.summaries);
  console.log("🧩 Adapted repo tasks:", payload.tasks);

  if (hasDuplicates) {
    console.warn("⚠️ Duplicate IDs detected in repository payload:", {
      duplicateSummaryIds,
      duplicateTaskIds
    });
  }

  return payload;
}

/* --------------------------------------------------------------
   EXISTING WORKSPACE ADAPTER (RESTORED EXPORT)
   -------------------------------------------------------------- */
/**
 * NOTE:
 * This function existed before Stage 6.9 and is used by DualPane.
 * It is preserved here to avoid regressions.
 */
export function adaptRepoPayloadToWorkspace(payload) {
  if (!payload) return null;

  // Pass-through by design (existing behaviour)
  return payload;
}
