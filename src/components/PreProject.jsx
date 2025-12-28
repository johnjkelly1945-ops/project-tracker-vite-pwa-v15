/*
=====================================================================
METRA — PreProject.jsx
Stage 21.3.A — Summary Creation via Workspace Owner
---------------------------------------------------------------------
• PreProject is a renderer / intent-raiser
• Does NOT own tasks or summaries
• Calls onAddSummary to mutate authoritative state in App
• No task creation
• No activation / popup changes
=====================================================================
*/

export default function PreProject({
  tasks = [],
  summaries = [],
  onAddSummary
}) {
  /* -------------------------------------------------
     Summary creation (PM-by-convention)
     ------------------------------------------------- */
  function handleAddSummary() {
    // PM-only authority is semantic; enforcement deferred (no login yet)
    const title = window.prompt("Summary title");
    if (!title || !title.trim()) return;
    onAddSummary(title);
  }

  /* -------------------------------------------------
     Render helpers
     ------------------------------------------------- */
  const tasksForSummary = (id) =>
    tasks.filter(task => task.summaryId === id);

  const orphanTasks = tasks.filter(task => task.summaryId == null);

  /* -------------------------------------------------
     Render
     ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      {/* Add Summary (PM-by-convention; enforcement deferred) */}
      <button onClick={handleAddSummary}>
        Add Summary
      </button>

      {/* Orphan tasks */}
      {orphanTasks.map(task => (
        <div key={task.id} style={{ cursor: "pointer" }}>
          {task.title}
        </div>
      ))}

      {/* Summaries */}
      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>

          {tasksForSummary(summary.id).map(task => (
            <div key={task.id} style={{ cursor: "pointer" }}>
              {task.title}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
