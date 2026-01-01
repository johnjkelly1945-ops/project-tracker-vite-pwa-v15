import React, { useState } from "react";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";

/**
 * App.jsx
 * Workspace owner.
 *
 * Stage 40
 * - Restores summary creation contract
 * - Preserves focus state (UI-only, ephemeral)
 */

export default function App() {
  // Workspace-owned state
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

  return (
    <div className="app-root">
      <ModuleHeader />

      <PreProject
        summaries={workspaceState.summaries}
        tasks={workspaceState.tasks}
        onAddSummary={handleAddSummary}
        focusedSummaryId={focusedSummaryId}
        setFocusedSummaryId={setFocusedSummaryId}
      />
    </div>
  );
}
