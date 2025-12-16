/* ======================================================================
   METRA – repoPayloadAdapter.js
   Stage 8.2.1 – Restore Workspace Contract (Regression Fix)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Preserve summary–task relationships
   ✔ Allow orphan tasks
   ✔ Prevent task collapse
   ✔ Maintain legacy workspace adapter contract
   ====================================================================== */

export function adaptRepoPayloadToWorkspace(payload) {
  const {
    type,
    summaries = [],
    tasks = []
  } = payload;

  /* --------------------------------------------------------------
     NORMALISE SUMMARIES
     -------------------------------------------------------------- */
  const summaryMap = {};
  const normalisedSummaries = summaries.map((s) => {
    const summary = {
      ...s,
      id: s.id,
      tasks: []
    };
    summaryMap[summary.id] = summary;
    return summary;
  });

  /* --------------------------------------------------------------
     NORMALISE TASKS
     -------------------------------------------------------------- */
  const normalisedTasks = tasks.map((t) => ({
    ...t,
    parentSummaryId:
      t.parentSummaryId !== undefined ? t.parentSummaryId : null
  }));

  /* --------------------------------------------------------------
     ENSURE SUMMARY SHELLS EXIST
     -------------------------------------------------------------- */
  normalisedTasks.forEach((task) => {
    if (
      task.parentSummaryId &&
      !summaryMap[task.parentSummaryId]
    ) {
      summaryMap[task.parentSummaryId] = {
        id: task.parentSummaryId,
        title: "(Imported summary)",
        tasks: []
      };
    }
  });

  /* --------------------------------------------------------------
     ASSIGN TASKS
     -------------------------------------------------------------- */
  const orphanTasks = [];

  normalisedTasks.forEach((task) => {
    if (
      task.parentSummaryId &&
      summaryMap[task.parentSummaryId]
    ) {
      summaryMap[task.parentSummaryId].tasks.push(task);
    } else {
      orphanTasks.push(task);
    }
  });

  /* --------------------------------------------------------------
     FLATTEN FOR WORKSPACE
     -------------------------------------------------------------- */
  const workspaceTasks = normalisedTasks.map((t) => ({
    ...t
  }));

  /* --------------------------------------------------------------
     FINAL OUTPUT (LEGACY-SAFE)
     -------------------------------------------------------------- */
  return {
    type,
    summaries: Object.values(summaryMap),
    tasks: workspaceTasks,
    orphanTasks
  };
}
