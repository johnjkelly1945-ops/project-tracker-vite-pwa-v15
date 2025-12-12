/* ======================================================================
   METRA – repoPayloadAdapter.js
   ----------------------------------------------------------------------
   SANDBOX-ONLY
   Adapts Repo Sandbox payloads into PreProject-compatible structures
   ====================================================================== */

import { taskLibrary } from "../taskLibrarySandbox";

/* ---------------------------------------------------------------
   MAIN ADAPTER
---------------------------------------------------------------- */
export function adaptRepoPayloadToWorkspace(payload) {
  if (!payload || !payload.type) {
    return { summaries: [], tasks: [] };
  }

  const selectedSummaryIds = payload.summaries || [];
  const selectedTaskIds = payload.tasks || [];

  const summaries = [];
  const tasks = [];

  const timestamp = Date.now();

  /* -------------------------------------------------------------
     BUILD SUMMARIES
  ------------------------------------------------------------- */
  selectedSummaryIds.forEach((summaryId, index) => {
    const sourceSummary = taskLibrary.summaries.find(
      s => s.id === summaryId
    );

    if (!sourceSummary) return;

    summaries.push({
      id: `repo_summary_${timestamp}_${index}`,
      title: sourceSummary.name,
      expanded: true,
      orderIndex: index
    });
  });

  /* -------------------------------------------------------------
     BUILD TASKS (ATTACHED TO SUMMARIES)
  ------------------------------------------------------------- */
  selectedTaskIds.forEach((taskId, index) => {
    const sourceTask = taskLibrary.tasks.find(
      t => t.id === taskId
    );

    if (!sourceTask) return;

    // Find which summary this task belongs to
    const sourceSummary = taskLibrary.summaries.find(
      s =>
        s.tasks?.includes(taskId) &&
        selectedSummaryIds.includes(s.id)
    );

    if (!sourceSummary) return;

    const targetSummary = summaries.find(
      s => s.title === sourceSummary.name
    );

    if (!targetSummary) return;

    tasks.push({
      id: `repo_task_${timestamp}_${index}`,
      title: sourceTask.name,
      summaryId: targetSummary.id,
      status: "Not Started",
      person: "",
      flag: "",
      orderIndex: index
    });
  });

  return { summaries, tasks };
}
