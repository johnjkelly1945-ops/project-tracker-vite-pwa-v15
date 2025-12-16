/* ======================================================================
   METRA – DualPane.jsx
   Stage 9.3 – Deterministic Placement (Honour Routing)
   ----------------------------------------------------------------------
   ✔ Deterministic summary → task binding
   ✔ Explicit routing honoured (pane)
   ✔ Replace-only semantics
   ✔ Orphan task detection (non-UI)
   ✔ Stage 9.2 scaffolding removed
   ====================================================================== */

import React, { useState, useCallback } from "react";
import RepositoryOverlay from "./RepositoryOverlay";

export default function DualPane() {
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [showRepository, setShowRepository] = useState(false);
  const [activePane, setActivePane] = useState(null); // neutral by design

  /* ==============================================================
     STAGE 9.3 – DETERMINISTIC PLACEMENT
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

    // Replace-only placement (honour routing)
    if (pane === "mgmt") {
      setMgmtTasks(assembledSummaries);
    } else if (pane === "dev") {
      setDevTasks(assembledSummaries);
    }

    if (orphanTasks.length > 0) {
      console.info("[Stage 9.3] Orphan tasks detected:", orphanTasks);
    }

    setShowRepository(false);
  }, []);

  /* ==============================================================
     Render
     ============================================================== */

  return (
    <div
      className="dual-pane-workspace"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* ==========================================================
         Workspace Header (Stage 9.1)
         ========================================================== */}
      <div
        className="workspace-header"
        style={{
          flexShrink: 0,
          padding: "8px 12px",
          borderBottom: "1px solid #e0e0e0",
          background: "#fafafa"
        }}
      >
        <button
          className="repo-open-btn"
          onClick={() => setShowRepository(true)}
        >
          Repository
        </button>
      </div>

      {/* ==========================================================
         Pane Container
         ========================================================== */}
      <div
        className="dual-pane-body"
        style={{ display: "flex", flex: 1, overflow: "hidden" }}
      >
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
      </div>

      {/* ==========================================================
         Repository Overlay
         ========================================================== */}
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
