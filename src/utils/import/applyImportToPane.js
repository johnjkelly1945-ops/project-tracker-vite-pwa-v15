/* ======================================================================
   METRA – applyImportToPane.js
   Stage 9.4.1 – Import Target Hardening
   ----------------------------------------------------------------------
   PURPOSE:
   • Enforce explicit import targets (mgmt | dev)
   • Provide a single, auditable import entry point
   • Prevent accidental or ambiguous pane mutation

   GUARANTEES:
   ✔ No repository mutation
   ✔ No adapter mutation
   ✔ No UI logic inside this file
   ✔ Deterministic behaviour only
   ====================================================================== */

export function applyImportToPane({
  targetPane,
  payload,
  setMgmtTasks,
  setDevTasks
}) {
  /* --------------------------------------------------------------
     1. Validate target pane
     -------------------------------------------------------------- */
  if (targetPane !== "mgmt" && targetPane !== "dev") {
    console.error(
      "❌ METRA IMPORT ABORTED — Invalid target pane:",
      targetPane
    );
    return false;
  }

  /* --------------------------------------------------------------
     2. Validate payload shape
     -------------------------------------------------------------- */
  if (!payload || typeof payload !== "object") {
    console.error(
      "❌ METRA IMPORT ABORTED — Invalid payload:",
      payload
    );
    return false;
  }

  const { summaries, tasks } = payload;

  if (!Array.isArray(summaries) || !Array.isArray(tasks)) {
    console.error(
      "❌ METRA IMPORT ABORTED — Payload missing summaries/tasks:",
      payload
    );
    return false;
  }

  /* --------------------------------------------------------------
     3. Deterministic replace-only apply
     -------------------------------------------------------------- */
  const nextState = [...summaries, ...tasks];

  if (targetPane === "mgmt") {
    setMgmtTasks(nextState);
  } else {
    setDevTasks(nextState);
  }

  /* --------------------------------------------------------------
     4. Dev-only confirmation
     -------------------------------------------------------------- */
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `✅ METRA IMPORT APPLIED → ${targetPane.toUpperCase()} PANE`,
      {
        summaries: summaries.length,
        tasks: tasks.length
      }
    );
  }

  return true;
}

