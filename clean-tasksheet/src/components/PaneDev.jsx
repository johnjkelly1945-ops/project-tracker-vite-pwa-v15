/* ======================================================================
   METRA – PaneDev.jsx
   Temporary Scroll Test version
   ----------------------------------------------------------------------
   • Confirms Chrome inner scrolling works
   • Header + Filter remain sticky
   • Bottom action row remains visible
   • Dummy tasks allow pane-scroll to exceed height
   ====================================================================== */

import React from "react";

export default function PaneDev() {
  return (
    <div className="pane">
      
      {/* =======================================================
          HEADER
      ======================================================== */}
      <div className="pane-header">
        <h2>Development Workspace</h2>
      </div>

      {/* =======================================================
          FILTER BAR
      ======================================================== */}
      <div className="dual-filter-bar">
        <div className="filter-btn">All</div>
        <div className="filter-btn">Not Started</div>
        <div className="filter-btn">In Progress</div>
        <div className="filter-btn">Completed</div>
      </div>

      {/* =======================================================
          SCROLL CONTAINER (real scrolling lives here)
      ======================================================== */}
      <div className="pane-scroll">
        
        {/* Summary block */}
        <div className="summary-block">
          <div className="summary-row">
            <span className="summary-dot"></span>
            <span className="task-title">Development Summary</span>
            <span className="summary-arrow">›</span>
          </div>
        </div>

        {/* ==========================================================
            TEMPORARY SCROLL TEST ITEMS
            Creates enough height for Chrome to scroll
        =========================================================== */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div className="task-item" key={i}>
            <div className="task-left">
              <span className="status-dot Not-Started"></span>
              <span>Debug Task {i + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* =======================================================
          BOTTOM ACTION BAR (sticky)
      ======================================================== */}
      <div className="bottom-action-row">
        <button>Add Task</button>
        <button>Save</button>
      </div>
    </div>
  );
}
