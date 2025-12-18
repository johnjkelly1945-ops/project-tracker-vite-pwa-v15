/* ======================================================================
   METRA – DualPane.jsx
   Stage 11.2a – Reattach Task Click → Popup
   ----------------------------------------------------------------------
   ✔ Deterministic summary → task binding preserved
   ✔ No repo logic changes
   ✔ No document logic changes
   ✔ Adds activeTask state + popup rendering
   ====================================================================== */

import React, { useState, useCallback } from "react";
import RepositoryOverlay from "./RepositoryOverlay";
import PopupOverlayWrapper from "./PopupOverlayWrapper";

export default function DualPane({ onCommitWorkspace }) {
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [showRepository, setShowRepository] = useState(false);
  const [activePane, setActivePane] = useState(null);
  const [workspaceCommitted, setWorkspaceCommitted] = useState(false);

  /* === NEW: Active task for popup === */
  const [activeTask, setActiveTask] = useState(null);
  const [activeTaskPane, setActiveTaskPane] = useState(null);

  /* ==============================================================
     STAGE 9.6 – DETERMINISTIC COMMIT (unchanged)
     ============================================================== */

  const handleRepositoryExport = useCallback(
    (adaptedPayload) => {
      if (!adaptedPayload) return;

      const { pane, summaries } = adaptedPayload;

      const assembledSummaries = [];
      const orphanTasks = [];
      const summaryMap = new Map();

      summaries.forEach((summary) => {
        if (!summary.repoSummaryId) return;
        summaryMap.set(summary.repoSummaryId, {
          ...summary,
          tasks: []
        });
      });

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

      summaries.forEach((summary) => {
        const resolved = summaryMap.get(summary.repoSummaryId);
        if (resolved) assembledSummaries.push(resolved);
      });

      if (pane === "mgmt") {
        setMgmtTasks(assembledSummaries);
      } else if (pane === "dev") {
        setDevTasks(assembledSummaries);
      }

      if (orphanTasks.length > 0) {
        console.info("[Stage 9.6] Orphan tasks detected:", orphanTasks);
      }

      if (!workspaceCommitted) {
        setWorkspaceCommitted(true);
        onCommitWorkspace?.();
      }

      setShowRepository(false);
    },
    [workspaceCommitted, onCommitWorkspace]
  );

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
        {/* Management Pane */}
        <div className="pane">
          <h2>Management Tasks</h2>

          {mgmtTasks.map((summary) => (
            <div key={summary.repoSummaryId} className="summary">
              <strong>{summary.title}</strong>

              {summary.tasks.map((task) => (
                <div
                  key={task.id}
                  className="task"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTask(task);
                    setActiveTaskPane("mgmt");
                  }}
                >
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
                <div
                  key={task.id}
                  className="task"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTask(task);
                    setActiveTaskPane("dev");
                  }}
                >
                  {task.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================================
         Task Popup (RESTORED)
         ========================================================== */}
      {activeTask && (
        <PopupOverlayWrapper
          task={activeTask}
          pane={activeTaskPane}
          onClose={() => setActiveTask(null)}
          onUpdate={(updated) => {
            // Placeholder: existing task update logic will already
            // handle this elsewhere in your app
            console.info("[TaskPopup update]", updated);
          }}
        />
      )}

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
