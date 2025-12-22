/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 12.2-C – User-Confirmed Instantiation (Intent-Only)
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Present repository content
   • Require explicit user confirmation to add a task
   • Emit INSTANTIATE_TASK_INTENT only on confirmation
   • Emit CLOSE_REPOSITORY_INTENT after successful add
   ----------------------------------------------------------------------
   NON-GOALS:
   • No workspace mutation
   • No task activation
   • No assignment
   • No routing
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/RepositoryView.css";

export default function RepositoryView() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ------------------------------------------------------------------
     Intent emitter (repository is intent-only)
     ------------------------------------------------------------------ */
  const emitIntent = (type, payload = null) => {
    const intent = {
      type,
      source: "RepositoryView",
      payload,
      timestamp: new Date().toISOString(),
    };

    console.log("🧭 REPOSITORY INTENT", intent);

    window.dispatchEvent(
      new CustomEvent("METRA_INTENT", { detail: intent })
    );
  };

  /* ------------------------------------------------------------------
     User-confirmed download
     (single task, placeholder payload for now)
     ------------------------------------------------------------------ */
  const confirmDownload = () => {
    emitIntent("INSTANTIATE_TASK_INTENT", {
      repoTaskId: "repo-task-placeholder",
      repoSummaryId: null,        // orphan by default
      title: "Imported repository task",
      description: "Imported via repository",
      targetPane: "mgmt",
    });

    // Workspace rule: repo closes after add
    emitIntent("CLOSE_REPOSITORY_INTENT");
    setConfirmOpen(false);
  };

  return (
    <div className="repo-overlay">

      {/* ===== Top Bar ===== */}
      <div className="repo-topbar">
        <h2>Repository</h2>

        <button
          className="repo-close-btn"
          onClick={() => emitIntent("CLOSE_REPOSITORY_INTENT")}
        >
          ✕
        </button>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="repo-content">

        <div className="repo-filters">
          <h3>Filters</h3>
          <p className="repo-placeholder">
            Filter controls will appear here.
          </p>
        </div>

        <div className="repo-summaries">
          <h3>Summaries</h3>
          <p className="repo-placeholder">
            Summary list will appear here.
          </p>
        </div>

        <div className="repo-tasks">
          <h3>Tasks</h3>
          <p className="repo-placeholder">
            Task list will appear here.
          </p>
        </div>

      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="repo-bottombar">

        <button
          className="repo-return-btn"
          onClick={() => emitIntent("CLOSE_REPOSITORY_INTENT")}
        >
          Return to Project
        </button>

        <button
          className="repo-download-btn"
          onClick={() => setConfirmOpen(true)}
        >
          Download to Project
        </button>

      </div>

      {/* ===== Confirmation Modal ===== */}
      {confirmOpen && (
        <div className="repo-confirm-overlay">
          <div className="repo-confirm-modal">
            <h3>Add task to workspace?</h3>
            <p>
              This will create a new <strong>inactive</strong> task in the
              workspace. You can activate it by assigning a person.
            </p>

            <div className="repo-confirm-actions">
              <button
                className="repo-confirm-cancel"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                className="repo-confirm-accept"
                onClick={confirmDownload}
              >
                Add to Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
