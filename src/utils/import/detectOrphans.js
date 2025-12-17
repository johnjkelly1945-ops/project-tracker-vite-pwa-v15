/* ======================================================================
   METRA – detectOrphans.js
   Stage 9.4.2 – Orphan Task Detection
   ----------------------------------------------------------------------
   PURPOSE:
   • Identify tasks that cannot be placed under a valid summary
   • Preserve orphan tasks explicitly
   • Prevent silent data loss or auto-assignment

   GUARANTEES:
   ✔ No repository mutation
   ✔ No adapter mutation
   ✔ No UI logic
   ✔ Deterministic, side-effect free
   ====================================================================== */

export function detectOrphans({ summaries, tasks }) {
  /* --------------------------------------------------------------
     1. Defensive validation
     -------------------------------------------------------------- */
  if (!Array.isArray(summaries) || !Array.isArray(tasks)) {
    console.error(
      "❌ METRA ORPHAN DETECTION FAILED — Invalid input:",
      { summaries, tasks }
    );
    return {
      validTasks: [],
      orphanTasks: []
    };
  }

  /* --------------------------------------------------------------
     2. Build summary lookup
     -------------------------------------------------------------- */
  const summaryIds = new Set(
    summaries
      .filter(s => s && s.id)
      .map(s => s.id)
  );

  /* --------------------------------------------------------------
     3. Partition tasks
     -------------------------------------------------------------- */
  const validTasks = [];
  const orphanTasks = [];

  for (const task of tasks) {
    if (!task || !task.summaryId) {
      orphanTasks.push(task);
      continue;
    }

    if (!summaryIds.has(task.summaryId)) {
      orphanTasks.push(task);
      continue;
    }

    validTasks.push(task);
  }

  /* --------------------------------------------------------------
     4. Dev-only reporting
     -------------------------------------------------------------- */
  if (process.env.NODE_ENV !== "production") {
    if (orphanTasks.length > 0) {
      console.warn(
        "⚠️ METRA ORPHAN TASKS DETECTED",
        orphanTasks
      );
    } else {
      console.log("✅ METRA — No orphan tasks detected");
    }
  }

  return {
    validTasks,
    orphanTasks
  };
}

