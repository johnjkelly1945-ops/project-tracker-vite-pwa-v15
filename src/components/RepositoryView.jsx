/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 12.3-B – Single Task Selection & Download Enablement
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Render repository tasks (placeholder data)
   • Allow SINGLE selection (switching selection allowed)
   • Enable "Download to Project" only when selected
   • Emit INSTANTIATE_TASK_INTENT with real task payload
   • Close repository after successful add
   ----------------------------------------------------------------------
   NON-GOALS:
   • No bulk selection
   • No summary creation
   • No workspace mutation here
   • No activation logic
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/RepositoryView.css";

/* ----------------------------------------------------------------------
   Placeholder repository tasks
   NOTE: Temporary for Stage 12.3; replaced with real repo data in Stage 13
   ---------------------------------------------------------------------- */
const PLACEHOLDER_REPO_TASKS = [
  {
    id: "repo-task-001",
    title: "Prepare project initiation notes",
    description: "Draft initial scope, assumptions, and constraints."
  },
  {
    id: "repo-task-002",
    title: "Identify key stakeholders",
    description: "List internal and external stakeholders."
  },
  {
    id: "repo-task-003",
    title: "Define success criteria",
    description: "Document measurable success factors."
  }
];

/* ----------------------------------------------------------------------
   Intent emitter (intent-only)
   ---------------------------------------------------------------------- */

export default function RepositoryView({
  discipline,
  onDownloadTask,
  onClose
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask =
    PLACEHOLDER_REPO_TASKS.find(t => t.id === selectedTaskId) || null;

  /* ------------------------------------------------------------------
     Handlers
     ------------------------------------------------------------------ */
  const handleSelect = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleDownload = () => {
    if (!selectedTask) return;

    onDownloadTask?.({
      repoTaskId: selectedTask.id,
      repoSummaryId: null,           // orphan-safe for now
      title: selectedTask.title,
      description: selectedTask.description,
      targetPane: "mgmt"
    });

    // Locked rule: repo closes after add
    onClose?.()
  };

  return (
    <div className="repo-overlay">

      {/* ===== Top Bar ===== */}
      <div className="repo-topbar">
        <h2>Repository</h2>

        <button
          className="repo-close-btn"
          onClick={() => onClose?.()}
        >
          ✕
        </button>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="repo-content">

        {/* Filters (placeholder) */}
        <div className="repo-filters">
          <h3>Filters</h3>
          <p className="repo-placeholder">
            Filtering will be enabled in a later stage.
          </p>
        </div>

        {/* Tasks (SINGLE SELECTION) */}
        <div className="repo-tasks">
          <h3>Tasks</h3>

          {PLACEHOLDER_REPO_TASKS.map(task => {
            const isSelected = task.id === selectedTaskId;

            return (
              <div
                key={task.id}
                className={`repo-task-row ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(task.id)}
              >
                <div className="repo-task-title">
                  {task.title}
                </div>

                <div className="repo-task-desc">
                  {task.description}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="repo-bottombar">

        <button
          className="repo-return-btn"
          onClick={() => onClose?.()}
        >
          Return to Project
        </button>

        <button
          className="repo-download-btn"
          disabled={!selectedTask}
          onClick={handleDownload}
        >
          Download to Project
        </button>

      </div>

    </div>
  );
}
