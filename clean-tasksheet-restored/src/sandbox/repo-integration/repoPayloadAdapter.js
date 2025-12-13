/* ======================================================================
   METRA – repoPayloadAdapter.js
   ----------------------------------------------------------------------
   SANDBOX-ONLY
   Normalises repository export payloads into true workspace
   summaries and tasks (data-shape parity only).

   Stage 5.1:
   ✔ Ensures imported tasks match native task structure
   ✔ No interaction wiring here
   ✔ No main METRA dependencies
   ====================================================================== */

import { taskLibrary } from "../taskLibrarySandbox.js";

/* --------------------------------------------------------------
   Helper: find task title by ID
-------------------------------------------------------------- */
function getTaskTitle(taskId) {
  const task = taskLibrary.tasks.find(t => t.id === taskId);
  return task ? task.name : `Task ${taskId}`;
}

/* --------------------------------------------------------------
   Helper: find summary title by ID
-------------------------------------------------------------- */
function getSummaryTitle(summaryId) {
  const summary = taskLibrary.summaries.find(s => s.id === summaryId);
  return summary ? summary.name : `Summary ${summaryId}`;
}

/* --------------------------------------------------------------
   Main Adapter
-------------------------------------------------------------- */
export function adaptRepoPayloadToWorkspace(payload) {
  const { summaries = [], tasks = [] } = payload;

  const timestamp = Date.now();
  let orderCounter = 0;

  /* ------------------------------------------------------------
     Normalise summaries
  ------------------------------------------------------------ */
  const normalisedSummaries = summaries.map((summaryId, index) => ({
    id: `repo_summary_${timestamp}_${index}`,
    title: getSummaryTitle(summaryId),
    expanded: true,
    orderIndex: orderCounter++
  }));

  /* ------------------------------------------------------------
     Normalise tasks (Stage 5.1 focus)
  ------------------------------------------------------------ */
  const normalisedTasks = tasks.map((taskId, index) => ({
    id: `repo_task_${timestamp}_${index}`,
    title: getTaskTitle(taskId),

    // --- REQUIRED WORKSPACE FIELDS ----------------------------
    status: "Not Started",
    person: "",
    flag: "",

    // Parent summary relationship is applied later by caller
    summaryId: null,

    orderIndex: orderCounter++
  }));

  return {
    summaries: normalisedSummaries,
    tasks: normalisedTasks
  };
}
