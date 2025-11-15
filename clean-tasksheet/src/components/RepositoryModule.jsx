/* ======================================================================
   METRA – RepositoryModule.jsx
   Step 7E – Unified Filter Bar (Type/Detail) + Summaries/Tasks Selection
   Forced new filename to break Safari/Vite stale module cache
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/Repository.css";

export default function RepositoryModule({ setScreen, onDownload }) {

  /* ================================================================
     TYPE (Category) options
     ================================================================ */
  const typeOptions = ["Management", "Development"];

  /* ================================================================
     DETAIL (Subcategory) options for each Type
     ================================================================ */
  const detailOptions = {
    Management: [
      "Generic",
      "PRINCE2",
      "Agile",
      "Waterfall",
      "Hybrid"
    ],
    Development: [
      "Generic",
      "Relocation",
      "Electrical",
      "Construction",
      "Software"
    ]
  };

  /* ================================================================
     Summaries Dataset
     ================================================================ */
  const summariesData = {
    Management: {
      Generic: [
        "Project Management Summary",
        "Governance Summary",
        "Change Control Summary",
        "Delivery Assurance Summary"
      ],
      PRINCE2: ["PRINCE2 Summary"],
      Agile: ["Agile Summary"],
      Waterfall: ["Waterfall Summary"],
      Hybrid: ["Hybrid Summary"]
    },

    Development: {
      Generic: [
        "Engineering Summary",
        "Development Delivery Summary",
        "Technical Requirements Summary"
      ],
      Relocation: ["Relocation Summary"],
      Electrical: ["Electrical Installation Summary"],
      Construction: ["Construction Summary"],
      Software: ["Software Development Summary"]
    }
  };

  /* ================================================================
     Tasks Dataset
     ================================================================ */
  const tasksData = {
    Management: {
      Generic: [
        "Draft Project Brief",
        "Create Stakeholder Map",
        "Complete Risk Scan",
        "Define Governance Path"
      ],
      PRINCE2: ["Create PID", "Product Breakdown"],
      Agile: ["Create Backlog", "Sprint Setup"],
      Waterfall: ["Create WBS", "Stage Gate Prep"],
      Hybrid: ["Hybrid Task – Setup"]
    },

    Development: {
      Generic: ["Site Survey", "Resource Allocation", "Readiness Check"],
      Relocation: ["Inventory Mapping", "Move Schedule"],
      Electrical: ["Safe Isolation Survey", "Load Assessment"],
      Construction: ["Excavation Permit Prep", "Site Layout Review"],
      Software: ["Requirements Gathering", "Technical Architecture Prep"]
    }
  };

  /* ================================================================
     Templates (Passive Only)
     ================================================================ */
  const templatesData = [
    "Project Charter – Template",
    "Communications Plan – Template",
    "Requirements Sheet – Template",
    "Risk Log – Template"
  ];

  /* ================================================================
     UI State
     ================================================================ */
  const [type, setType] = useState("Management");
  const [detail, setDetail] = useState("Generic");

  const [selectedSummaries, setSelectedSummaries] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  /* ================================================================
     Toggle summary/task selection
     ================================================================ */
  const toggleSummary = (name) => {
    setSelectedSummaries(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  const toggleTask = (title) => {
    setSelectedTasks(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  /* ================================================================
     Download → PreProject
     ================================================================ */
  const handleDownload = () => {
    const bundled = [
      ...selectedSummaries.map((name, index) => ({
        id: Date.now() + index,
        title: name,
        status: "Not Started"
      })),
      ...selectedTasks.map((title, index) => ({
        id: Date.now() + 100 + index,
        title,
        status: "Not Started"
      }))
    ];

    if (bundled.length === 0) {
      alert("No items selected.");
      return;
    }

    onDownload(bundled);
  };

  /* ================================================================
     UI
     ================================================================ */
  return (
    <div className="repository-wrapper">

      {/* HEADER */}
      <div className="repo-header">
        <h1>Repository Task Selection</h1>
        <button className="repo-close" onClick={() => setScreen("preproject")}>
          ✕
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar-unified">

        {/* TYPE */}
        <div className="filter-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setDetail("Generic");
            }}
          >
            {typeOptions.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* DETAIL */}
        <div className="filter-group">
          <label>Detail</label>
          <select
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          >
            {detailOptions[type].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* DOWNLOAD */}
        <button className="download-btn" onClick={handleDownload}>
          Download Selected Tasks
        </button>
      </div>

      {/* 3 COLUMNS */}
      <div className="repo-columns">

        {/* SUMMARIES */}
        <div className="repo-col">
          <h2>Summaries</h2>
          <div className="repo-list">
            {summariesData[type][detail].map((summary) => (
              <label key={summary} className="repo-item-selectable">
                <input
                  type="checkbox"
                  checked={selectedSummaries.includes(summary)}
                  onChange={() => toggleSummary(summary)}
                />
                <span className="blue-dot">●</span>
                {summary}
              </label>
            ))}
          </div>
        </div>

        {/* TASKS */}
        <div className="repo-col">
          <h2>Tasks</h2>
          <div className="repo-list">
            {tasksData[type][detail].map((task) => (
              <label key={task} className="repo-item-selectable">
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task)}
                  onChange={() => toggleTask(task)}
                />
                {task}
              </label>
            ))}
          </div>
        </div>

        {/* TEMPLATES */}
        <div className="repo-col">
          <h2>Templates</h2>
          <div className="repo-list">
            {templatesData.map((temp, index) => (
              <div key={index} className="repo-item">
                {temp}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
