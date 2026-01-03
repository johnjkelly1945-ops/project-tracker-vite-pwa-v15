/**
 * =====================================================================
 * METRA — App.jsx
 * =====================================================================
 *
 * ROLE
 * ---------------------------------------------------------------------
 * Workspace owner and top-level state coordinator.
 *
 * STAGE HISTORY
 * ---------------------------------------------------------------------
 * Stage 28 — Task creation via intent (SEM-05)
 * Stage 40 — Focus state (UI-only)
 * Stage 51 — Task ↔ Summary association mechanism verified
 * Stage 53.1 — Task popup invocation surface (read-only)
 * Stage 53.2 — Summary selection act (UI-only, non-persistent)
 *
 * IMPORTANT INVARIANTS
 * ---------------------------------------------------------------------
 * - No task or summary mutation in this file for Stage 53.2
 * - summaries are passed read-only into the popup
 * =====================================================================
 */

import React, { useState } from "react";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  const [focusedSummaryId, setFocusedSummaryId] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  function handleAddSummary() {
    setWorkspaceState((prev) => ({
      ...prev,
      summaries: [
        ...prev.summaries,
        {
          id: crypto.randomUUID(),
          title: `Summary ${prev.summaries.length + 1}`,
        },
      ],
    }));
  }

  function handleCreateTaskIntent(intent) {
    if (!intent || !intent.title) return;

    setWorkspaceState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: crypto.randomUUID(),
          title: intent.title,
          summaryId: intent.summaryId ?? null,
        },
      ],
    }));
  }

  function handleOpenTask(task) {
    setActiveTask(task);
  }

  function handleCloseTask() {
    setActiveTask(null);
  }

  return (
    <div className="app-root">
      <ModuleHeader />

      <PreProject
        summaries={workspaceState.summaries}
        tasks={workspaceState.tasks}
        onAddSummary={handleAddSummary}
        onCreateTaskIntent={handleCreateTaskIntent}
        focusedSummaryId={focusedSummaryId}
        setFocusedSummaryId={setFocusedSummaryId}
        onOpenTask={handleOpenTask}
      />

      {activeTask && (
        <TaskPopup
          task={activeTask}
          summaries={workspaceState.summaries}
          onClose={handleCloseTask}
        />
      )}
    </div>
  );
}
