/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 12.1-B – Repository (Intent-Only, Modal Hosted)
   ----------------------------------------------------------------------
   • Emits intent only
   • Does not control workspace visibility
   • Does not perform navigation
   ====================================================================== */

import React from "react";
import "../Styles/RepositoryView.css";

export default function RepositoryView() {

  const emitIntent = (type) => {
    const payload = {
      type,
      source: "RepositoryView",
      timestamp: new Date().toISOString(),
    };

    console.log("🧭 REPOSITORY INTENT", payload);

    window.dispatchEvent(
      new CustomEvent("METRA_INTENT", { detail: payload })
    );
  };

  return (
    <div className="repo-overlay">

      {/* ===== Top Bar ===== */}
      <div className="repo-topbar">
        <h2>Repository</h2>

        {/* X Close */}
        <button
          className="repo-close-btn"
          onClick={() => emitIntent("CLOSE_REPOSITORY_INTENT")}
        >
          ✕
        </button>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="repo-content">

        {/* Filters Section */}
        <div className="repo-filters">
          <h3>Filters</h3>
          <p className="repo-placeholder">
            Filter controls will appear here.
          </p>
        </div>

        {/* Summary List */}
        <div className="repo-summaries">
          <h3>Summaries</h3>
          <p className="repo-placeholder">
            Summary list will appear here.
          </p>
        </div>

        {/* Task List */}
        <div className="repo-tasks">
          <h3>Tasks</h3>
          <p className="repo-placeholder">
            Tasks for selected summary will appear here.
          </p>
        </div>

      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="repo-bottombar">

        {/* Return / Cancel */}
        <button
          className="repo-return-btn"
          onClick={() => emitIntent("CLOSE_REPOSITORY_INTENT")}
        >
          Return to Project
        </button>

        {/* Download (disabled until Stage 12.2) */}
        <button className="repo-download-btn" disabled>
          Download to Project
        </button>

      </div>

    </div>
  );
}
