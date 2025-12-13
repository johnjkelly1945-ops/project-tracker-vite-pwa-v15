/* ======================================================================
   METRA – repoPayloadAdapter.js
   Workspace-Safe Adapter
   ----------------------------------------------------------------------
   ✔ Normalises repo payload
   ✔ Preserves summary → task hierarchy
   ✔ Enforces flat workspace contract
   ✔ No side effects
   ✔ No persistence
   ====================================================================== */

export function adaptRepoPayloadToWorkspace(payload) {
  if (!payload) {
    console.warn("⚠️ Empty repo payload received");
    return { summaries: [], tasks: [], type: null };
  }

  const { summaries = [], tasks = [] } = payload;

  // 🔐 NORMALISE TYPE (critical fix)
  const type =
    payload.type?.toLowerCase() === "mgmt" ? "mgmt" :
    payload.type?.toLowerCase() === "dev"  ? "dev"  :
    null;

  // --- Normalise summaries -----------------------------------------
  const normalisedSummaries = summaries.map((s, index) => ({
    id: s.id ?? `repo-summary-${index}`,
    title: s.title ?? s.name ?? String(s),
    expanded: true,
    source: "repo"
  }));

  const summaryIdMap = {};
  normalisedSummaries.forEach(s => {
    summaryIdMap[s.id] = s.id;
  });

  // --- Normalise tasks ---------------------------------------------
  const normalisedTasks = tasks.map((t, index) => ({
    id: t.id ?? `repo-task-${index}`,
    title: t.title ?? t.name ?? String(t),
    status: "Not Started",
    summaryId:
      t.summaryId && summaryIdMap[t.summaryId]
        ? t.summaryId
        : null,
    source: "repo"
  }));

  console.log("🧩 Adapted repo summaries:", normalisedSummaries);
  console.log("🧩 Adapted repo tasks:", normalisedTasks);

  return {
    type,
    summaries: normalisedSummaries,
    tasks: normalisedTasks
  };
}
