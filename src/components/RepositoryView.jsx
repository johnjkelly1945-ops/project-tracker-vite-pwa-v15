/* ======================================================================
   METRA – RepositoryView.jsx
   v1 – Fullscreen Repository Framework
   ====================================================================== */

import React from "react";
import "../Styles/RepositoryView.css";

export default function RepositoryView({
  ccSourcePane,
  onCancel,
  onDownload
}) {
  return (
    <div className="repo-overlay">

      {/* ===== Top Bar ===== */}
      <div className="repo-topbar">
        <h2>Repository</h2>

        {/* X Close */}
        <button className="repo-close-btn" onClick={onCancel}>
          ✕
        </button>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="repo-content">

        {/* Filters Section */}
        <div className="repo-filters">
          <h3>Filters</h3>
          <p className="repo-placeholder">Filter controls will appear here.</p>
        </div>

        {/* Summary List */}
        <div className="repo-summaries">
          <h3>Summaries</h3>
          <p className="repo-placeholder">Summary list will appear here.</p>
        </div>

        {/* Task List */}
        <div className="repo-tasks">
          <h3>Tasks</h3>
          <p className="repo-placeholder">Tasks for selected summary will appear here.</p>
        </div>

      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="repo-bottombar">

        {/* Return / Cancel */}
        <button className="repo-return-btn" onClick={onCancel}>
          Return to Project
        </button>

        {/* Download (disabled for now) */}
        <button className="repo-download-btn" disabled>
          Download to Project
        </button>

      </div>

    </div>
  );
}
