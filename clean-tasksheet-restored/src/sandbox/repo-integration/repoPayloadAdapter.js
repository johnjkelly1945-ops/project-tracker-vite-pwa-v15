/* ======================================================================
   METRA – repoPayloadAdapter.js
   Stage 6.1 – Workspace-Safe Adapter (Sandbox Only)
   ----------------------------------------------------------------------
   ✔ Normalises repo payload
   ✔ Preserves summary → task hierarchy
   ✔ No side effects
   ✔ No persistence
   ====================================================================== */

export function adaptRepoPayloadToWorkspace(payload) {
  if (!payload) {
    console.warn("⚠️ Empty repo payload received");
    return { summaries: [], tasks: [], type: null };
  }

  const { type, summaries = [], tasks = [] } = payload;

  // --- Normalise summaries -----------------------------------------
  const normalisedSummaries = summaries.map((s, index) => ({
    id: s.id ?? `repo-summary-${index}`,
    title: s.title ?? String(s),
    expanded: true,
  }));

  const summaryIdMap = {};
  normalisedSummaries.forEach(s => {
    summaryIdMap[s.id] = s.id;
  });

  // --- Normalise tasks ---------------------------------------------
  const normalisedTasks = tasks.map((t, index) => ({
    id: t.id ?? `repo-task-${index}`,
    title: t.title ?? String(t),
    status: "Not Started",
    summaryId: t.summaryId && summaryIdMap[t.summaryId]
      ? t.summaryId
      : null,
  }));

  console.log("🧩 Adapted repo summaries:", normalisedSummaries);
  console.log("🧩 Adapted repo tasks:", normalisedTasks);

  return {
    type,
    summaries: normalisedSummaries,
    tasks: normalisedTasks,
  };
}
