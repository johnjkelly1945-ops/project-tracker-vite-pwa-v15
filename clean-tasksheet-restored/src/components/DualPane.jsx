/* ======================================================================
   METRA – DualPane.jsx
   Stage 8.3 – Deterministic Repository Import
   FINAL wiring fix (onExport contract)
   ----------------------------------------------------------------------
   ✔ Deterministic summary → task binding
   ✔ Multiple summaries per import
   ✔ Replace-only semantics preserved
   ✔ Orphan task detection (non-UI)
   ✔ Correct RepositoryOverlay contract
   ====================================================================== */

import React, { useState, useCallback } from "react";
import RepositoryOverlay from "./RepositoryOverlay";

export default function DualPane() {
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [showRepository, setShowRepository] = useState(false);
  const [activePane, setActivePane] = useState("mgmt");

  /* ==============================================================
     STAGE 8.3 – DETERMINISTIC REPOSITORY IMPORT
     ============================================================== */

  const handleRepositoryExport = useCallback((adaptedPayload) => {
    if (!adaptedPayload) return;

    const { pane, summaries } = adaptedPayload;

    const assembledSummaries = [];
    const orphanTasks = [];
    const summaryMap = new Map();

    // Build summary shells (identity-first)
    summaries.forEach((summary) => {
      if (!summary.repoSummaryId) return;
      summaryMap.set(summary.repoSummaryId, {
        ...summary,
        tasks: []
      });
    });

    // Attach tasks deterministically
    summaries.forEach((summary) => {
      const { tasks = [] } = summary;
      tasks.forEach((task) => {
        const parentId = task.repoSummaryId;
        if (parentId && summaryMap.has(parentId)) {
          summaryMap.get(parentId).tasks.push(task);
        } else {
          orphanTasks.push(task);
        }
      });
    });

    // Preserve repository order
    summaries.forEach((summary) => {
      const resolved = summaryMap.get(summary.repoSummaryId);
      if (resolved) assembledSummaries.push(resolved);
    });

    // Replace-only commit
    if (pane === "mgmt") {
      setMgmtTasks(assembledSummaries);
    } else {
      setDevTasks(assembledSummaries);
    }

    if (orphanTasks.length > 0) {
      console.info("[Stage 8.3] Orphan tasks detected:", orphanTasks);
    }

    setShowRepository(false);
  }, []);

  /* ==============================================================
     Render
     ============================================================== */

  return (
    <div className="dual-pane-workspace">
      {/* Workspace Header */}
      <div className="workspace-header">
        <button
          className="repo-open-btn"
          onClick={() => {
            setActivePane("mgmt");
            setShowRepository(true);
          }}
        >
          Open Repository
        </button>
      </div>

      {/* Management Pane */}
      <div className="pane">
        <h2>Management Tasks</h2>
        {mgmtTasks.map((summary) => (
          <div key={summary.repoSummaryId} className="summary">
            <strong>{summary.title}</strong>
            {summary.tasks.map((task) => (
              <div key={task.id} className="task">
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Development Pane */}
      <div className="pane">
        <h2>Development Tasks</h2>
        {devTasks.map((summary) => (
          <div key={summary.repoSummaryId} className="summary">
            <strong>{summary.title}</strong>
            {summary.tasks.map((task) => (
              <div key={task.id} className="task">
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Repository Overlay */}
      {showRepository && (
        <RepositoryOverlay
          activePane={activePane}
          onExport={handleRepositoryExport}
          onClose={() => setShowRepository(false)}
        />
      )}
    </div>
  );
}
