import React, { useState } from "react";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";

/**
 * App.jsx
 * Workspace owner.
 *
 * Stage 28 (RESTORED):
 * - Task creation via intent
 * - Summary optional (SEM-05)
 *
 * Stage 40:
 * - Summary creation preserved
 * - Focus state preserved (UI-only, ephemeral)
 *
 * Stage 51:
 * - Task ↔ Summary association mechanism VERIFIED
 * - No UI or verification scaffolding remains
 */

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
   * Restore summary creation (as before)
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
      />
    </div>
  );
}
