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
 * Stage 28 (RESTORED)
 * - Task creation via intent
 * - Summary optional (SEM-05)
 *
 * Stage 40
 * - Summary creation preserved
 * - Focus state preserved (UI-only, ephemeral)
 *
 * Stage 51
 * - Task ↔ Summary association MECHANISM verified
 * - No UI or verification scaffolding remains
 *
 * Stage 53.1 (CURRENT)
 * - Reintroduces task popup as a TASK-SCOPED INVOCATION SURFACE ONLY
 * - Popup is READ-ONLY
 * - No summary selection
 * - No editing
 * - No authority logic
 *
 * IMPORTANT INVARIANTS
 * ---------------------------------------------------------------------
 * - activeTask is UI-only and non-persistent
 * - Opening the popup MUST NOT mutate task state
 * - Closing the popup MUST be non-destructive
 * - Any behavioural expansion requires a later stage
 * =====================================================================
 */

import React, { useState } from "react";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  // ------------------------------------------------------------------
  // Workspace-owned state
  // ------------------------------------------------------------------
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  /**
   * Stage 40 — Focus state (UI-only, non-persistent)
   */
  const [focusedSummaryId, setFocusedSummaryId] = useState(null);

  /**
   * Stage 53.1 — Active task for popup (UI-only, non-persistent)
   */
  const [activeTask, setActiveTask] = useState(null);

  /**
   * Restore summary creation (unchanged behaviour)
   */
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

  /**
   * RESTORED — Task creation (Stage 28 contract)
   */
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

  /**
   * Stage 53.1 — Open task popup (invocation only)
   */
  function handleOpenTask(task) {
    setActiveTask(task);
  }

  /**
   * Stage 53.1 — Close task popup (non-destructive)
   */
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
        <TaskPopup task={activeTask} onClose={handleCloseTask} />
      )}
    </div>
  );
}
