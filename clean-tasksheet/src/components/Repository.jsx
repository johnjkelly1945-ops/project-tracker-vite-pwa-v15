/* ======================================================================
   METRA – Repository.jsx
   Step 7D – Full Repository Module (Summaries / Tasks / Templates)
   ----------------------------------------------------------------------
   • Full-screen module with blue header bar
   • Summaries (blue-dot), Tasks (selectable), Templates (passive)
   • Download → returns selected tasks to PreProject
   • Close (X) returns without changes
   • Clean, Governance-aligned UI (white panels, clear spacing)
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/Repository.css";

export default function Repository({ setScreen, onDownload }) {

  /* ====================================================================
     SAMPLE STRUCTURE (Phase 7 – Clean Repository)
     Later these will come from your Template Repository dataset.
     ==================================================================== */

  const [summaries, setSummaries] = useState([
    { id: 1, name: "Project Management Summary" },
    { id: 2, name: "Development Summary" }
  ]);

  const [tasks, setTasks] = useState([
    { id: 101, title: "Write Project Charter" },
    { id: 102, title: "Create Initial Milestone Plan" },
    { id: 103, title: "Establish Communications Plan" },
    { id: 104, title: "Build Requirements List" }
  ]);

  const [templates] = useState([
    "Project Charter – Template A",
    "Communications Plan – Template B",
    "Requirements Sheet – Template C"
  ]);

  const [selectedTasks, setSelectedTasks] = useState([]);

  /* ====================================================================
     TASK SELECTION
     ==================================================================== */
  const toggleTask = (task) => {
    setSelectedTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) return prev.filter((t) => t.id !== task.id);
      return [...prev, task];
    });
  };

  /* ====================================================================
     NEW SUMMARY (auto blue-dot)
     ==================================================================== */
  const addNewSummary = () => {
    const name = prompt("Enter summary name:");
    if (!name) return;
    setSummaries(prev => [
      ...prev,
      { id: Date.now(), name }
    ]);
  };

  /* ====================================================================
     DOWNLOAD → SEND BACK TO PREPROJECT
     ==================================================================== */
  const handleDownload = () => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected.");
      return;
    }
    onDownload(selectedTasks);
  };

  return (
    <div className="repository-wrapper">

      {/* BLUE HEADER */}
      <div className="repo-header">
        <h1>Repository Task Selection</h1>

        <button
          className="repo-close"
          onClick={() => setScreen("preproject")}
        >
          ✕
        </button>
      </div>

      {/* FILTER / ACTION ROW */}
      <div className="repo-actions">
        <div />
        <button className="download-btn" onClick={handleDownload}>
          Download Selected Tasks
        </button>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="repo-columns">

        {/* ==============================
             COLUMN 1 – SUMMARIES
           ============================== */}
        <div className="repo-col">
          <h2>Summaries</h2>

          <div className="repo-list">
            {summaries.map((s) => (
              <div key={s.id} className="repo-item">
                <span className="blue-dot">●</span>
                {s.name}
              </div>
            ))}
          </div>

          <button className="new-summary-btn" onClick={addNewSummary}>
            + New Summary Task
          </button>
        </div>

        {/* ==============================
             COLUMN 2 – TASKS
           ============================== */}
        <div className="repo-col">
          <h2>Tasks</h2>

          <div className="repo-list">
            {tasks.map((t) => (
              <label key={t.id} className="repo-item-selectable">
                <input
                  type="checkbox"
                  checked={!!selectedTasks.find(x => x.id === t.id)}
                  onChange={() => toggleTask(t)}
                />
                {t.title}
              </label>
            ))}
          </div>
        </div>

        {/* ==============================
             COLUMN 3 – TEMPLATES
           ============================== */}
        <div className="repo-col">
          <h2>Templates</h2>

          <div className="repo-list">
            {templates.map((temp, i) => (
              <div key={i} className="repo-item">
                {temp}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
