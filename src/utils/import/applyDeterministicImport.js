/* ======================================================================
   METRA – applyDeterministicImport.js
   Stage 9.4.3 – Controlled Pane Application
   ----------------------------------------------------------------------
   PURPOSE:
   • Wire orphan detection + pane application
   • Enforce deterministic, replace-only imports
   • Preserve orphan tasks explicitly
   • Provide a single safe import entry point

   GUARANTEES:
   ✔ No repository mutation
   ✔ No adapter mutation
   ✔ No UI logic
   ✔ No silent data loss
   ====================================================================== */

import { detectOrphans } from "./detectOrphans";
import { applyImportToPane } from "./applyImportToPane";

export function applyDeterministicImport({
  targetPane,
  payload,
  setMgmtTasks,
  setDevTasks
}) {
  /* --------------------------------------------------------------
     1. Defensive payload validation
     -------------------------------------------------------------- */
  if (!payload || typeof payload !== "object") {
    console.error(
      "❌ METRA IMPORT FAILED — Invalid payload:",
      payload
    );
    return {
      applied: false,
      orphanTasks: []
    };
  }

  const { summaries, tasks } = payload;

  /* --------------------------------------------------------------
     2. Detect orphan tasks
     -------------------------------------------------------------- */
  const {
    validTasks,
    orphanTasks
  } = detectOrphans({ summaries, tasks });

  /* --------------------------------------------------------------
     3. Apply valid data only (replace-only)
     -------------------------------------------------------------- */
  const applied = applyImportToPane({
    targetPane,
    payload: {
      summaries,
      tasks: validTasks
    },
    setMgmtTasks,
    setDevTasks
  });

  /* --------------------------------------------------------------
     4. Dev-only reporting
     -------------------------------------------------------------- */
  if (process.env.NODE_ENV !== "production") {
    console.log("📦 METRA IMPORT RESULT", {
      targetPane,
      summaries: summaries?.length ?? 0,
      appliedTasks: validTasks.length,
      orphanTasks: orphanTasks.length
    });
  }

  return {
    applied,
    orphanTasks
  };
}

