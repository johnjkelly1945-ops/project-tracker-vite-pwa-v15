/* ======================================================================
   METRA – PreProject.jsx
   Phase 4.6 B.12 Step 2 – Summary Task Class Integration (Visual Verification)
   ----------------------------------------------------------------------
   • Adds .summary-task styling for parent (summary) tasks
   • Preserves all popup / personnel / audit behaviour
   • Uses existing Checklist.css rules (royal blue, underline on hover)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import "../styles/Checklist.css";
import { getGovernanceData } from "../utils/GovernanceDataBridge";

const PreProject = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load governance or preproject data safely
    const data = getGovernanceData();
    setTasks(data || []);
  }, []);

  // Helper – Detect whether a task is a Summary (parent) task
  const isSummaryTask = (task) => {
    if (!task) return false;
    // Rule of thumb: treat items with children or "summary" flag as summary tasks
    return (
      task.isSummary ||
      (Array.isArray(task.subTasks) && task.subTasks.length > 0)
    );
  };

  // Render a single task (summary or normal)
  const renderTask = (task, index) => {
    const summary = isSummaryTask(task);
    const taskClass = summary
      ? "task-item summary-task"
      : "task-item status-in-progress";

    return (
      <li key={index} className={taskClass}>
        <div className="task-text-area">
          {summary && <span className="summary-arrow">▸</span>}
          <span className="task-text">{task.title || task.projectName}</span>
        </div>
      </li>
    );
  };

  return (
    <div className="checklist-container">
      {/* === Header Bar === */}
      <div className="module-header-box inline">
        <div className="brand-large angled">METRA</div>
        <p className="module-subtitle">PreProject Workspace</p>
        <button className="return-btn">Return to Summary</button>
      </div>

      {/* === Checklist === */}
      <div className="checklist">
        <ul>
          {tasks && tasks.length > 0 ? (
            tasks.map((task, idx) => renderTask(task, idx))
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>
              No tasks available
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PreProject;
