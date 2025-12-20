/* ======================================================================
   METRA – DualPane.jsx
   Stage 9.3+ – Deterministic Placement (Honour Routing)
   ----------------------------------------------------------------------
   ✔ Deterministic summary → task binding
   ✔ Explicit routing honoured when provided
   ✔ Replace-only semantics
   ✔ Standalone tasks rendered (first-class)
   ✔ TEMPORARY default routing → Management (Stage 11 only)
   ====================================================================== */

import React, { useState, useCallback } from "react";
import RepositoryOverlay from "./RepositoryOverlay";

export default function DualPane() {
  /* --------------------------------------------------------------
     Workspace State
     -------------------------------------------------------------- */

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  const [mgmtStandaloneTasks, setMgmtStandaloneTasks] = useState([]);
  const [devStandaloneTasks, setDevStandaloneTasks] = useState([]);

  const [showRepository, setShowRepository] = useState(false);
  const [activePane, setActivePane] = useState(null); // neutral by design

  /* ==============================================================
     REPOSITORY EXPORT HANDLER
     ============================================================== */

  const handleRepositoryExport = useCallback((adaptedPayload) => {
    if (!adaptedPayload) return;

    const {
      pane,
      summaries = [],
      tasks = []
    } = adaptedPayload;

    console.log("📥 DualPane received payload", adaptedPayload);

    const assembledSummaries = [];
    const summaryMap = new Map();

    /* ------------------------------------------------------------
       Build summary shells (identity-first)
       ------------------------------------------------------------ */
    summaries.forEach((summary) => {
      if (!summary.repoSummaryId) return;

      summaryMap.set(summary.repoSummaryId, {
        ...summary,
        tasks: []
      });
    });

    /* ------------------------------------------------------------
       Attach tasks to summaries deterministically
       ------------------------------------------------------------ */
    summaries.forEach((summary) => {
      const { tasks = [] } = summary;

      tasks.forEach((task) => {
        const parentId = task.repoSummaryId;
        if (parentId && summaryMap.has(parentId)) {
          summaryMap.get(parentId).tasks.push(task);
        }
      });
    });

    /* ------------------------------------------------------------
       Preserve repository order
       ------------------------------------------------------------ */
    summaries.forEach((summary) => {
      const resolved = summaryMap.get(summary.repoSummaryId);
      if (resolved) assembledSummaries.push(resolved);
    });

    /* ------------------------------------------------------------
       Replace-only placement (honour routing)
       ------------------------------------------------------------ */
    if (pane === "mgmt") {
      setMgmtSummaries(assembledSummaries);
      setMgmtStandaloneTasks(tasks);
    } else if (pane === "dev") {
      setDevSummaries(assembledSummaries);
      setDevStandaloneTasks(tasks);
    } else {
      console.warn(
        "⚠️ No pane specified in repo payload — defaulting to Management (temporary, Stage 11)"
      );
      setMgmtSummaries(assembledSummaries);
      setMgmtStandaloneTasks(tasks);
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
         Workspace Header
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
        {/* ===================== Management Pane ===================== */}
        <div className="pane" style={{ flex: 1, padding: "8px" }}>
          <h2>Management Tasks</h2>

          {/* Summaries */}
          {mgmtSummaries.map((summary) => (
            <div key={summary.repoSummaryId} className="summary">
              <strong>{summary.title}</strong>

              {summary.tasks.map((task) => (
                <div key={task.id} className="task">
                  {task.title}
                </div>
              ))}
            </div>
          ))}

          {/* Standalone Tasks */}
          {mgmtStandaloneTasks.map((task) => (
            <div key={task.id} className="task standalone-task">
              {task.title}
            </div>
          ))}
        </div>

        {/* ===================== Development Pane ===================== */}
        <div className="pane" style={{ flex: 1, padding: "8px" }}>
          <h2>Development Tasks</h2>

          {/* Summaries */}
          {devSummaries.map((summary) => (
            <div key={summary.repoSummaryId} className="summary">
              <strong>{summary.title}</strong>

              {summary.tasks.map((task) => (
                <div key={task.id} className="task">
                  {task.title}
                </div>
              ))}
            </div>
          ))}

          {/* Standalone Tasks */}
          {devStandaloneTasks.map((task) => (
            <div key={task.id} className="task standalone-task">
              {task.title}
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================================
         Repository Overlay
         ========================================================== */}
      {showRepository && (
        <RepositoryOverlay
          activePane={activePane || undefined}
          onExport={handleRepositoryExport}
          onClose={() => setShowRepository(false)}
        />
      )}
    </div>
  );
}
