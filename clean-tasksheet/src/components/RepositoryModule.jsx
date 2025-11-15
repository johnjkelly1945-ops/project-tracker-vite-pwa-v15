/* ======================================================================
   METRA – RepositoryModule.jsx
   Step 7K – TRUE CUSTOM CHECKBOXES (NO native <input>)
   Guaranteed visibility in Safari/Chrome
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/Repository.css";

export default function RepositoryModule({ setScreen, onDownload }) {

  const typeOptions = ["Management", "Development"];

  const detailOptions = {
    Management: ["Generic", "PRINCE2", "Agile", "Waterfall", "Hybrid"],
    Development: ["Generic", "Relocation", "Electrical", "Construction", "Software"]
  };

  const summariesData = {
    Management: {
      Generic: [
        "Project Management Summary",
        "Governance Summary",
        "Change Control Summary",
        "Delivery Assurance Summary"
      ]
    },
    Development: {
      Generic: [
        "Engineering Summary",
        "Development Delivery Summary",
        "Technical Requirements Summary"
      ]
    }
  };

  const tasksData = {
    Management: {
      Generic: [
        "Draft Project Brief",
        "Create Stakeholder Map",
        "Complete Risk Scan",
        "Define Governance Path"
      ]
    },
    Development: {
      Generic: ["Site Survey", "Resource Allocation", "Readiness Check"]
    }
  };

  const templatesData = [
    "Project Charter – Template",
    "Communications Plan – Template",
    "Requirements Sheet – Template",
    "Risk Log – Template"
  ];

  const [type, setType] = useState("Management");
  const [detail, setDetail] = useState("Generic");

  const [selectedSummaries, setSelectedSummaries] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const toggleSummary = (name) => {
    setSelectedSummaries((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const toggleTask = (name) => {
    setSelectedTasks((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleDownload = () => {
    const bundled = [
      ...selectedSummaries.map((name) => ({
        id: Date.now() + Math.random(),
        title: name,
        status: "Not Started"
      })),
      ...selectedTasks.map((name) => ({
        id: Date.now() + Math.random(),
        title: name,
        status: "Not Started"
      }))
    ];

    if (bundled.length === 0) {
      alert("No items selected.");
      return;
    }

    onDownload(bundled);
  };

  return (
    <div className="repository-wrapper">

      <div className="repo-header">
        <h1>Repository Task Selection</h1>
        <button className="repo-close" onClick={() => setScreen("preproject")}>
          ✕
        </button>
      </div>

      <div className="filter-bar-unified">
        <div className="filter-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setDetail("Generic");
            }}
          >
            {typeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Detail</label>
          <select value={detail} onChange={(e) => setDetail(e.target.value)}>
            {detailOptions[type].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <button className="download-btn" onClick={handleDownload}>
          Download Selected Tasks
        </button>
      </div>

      <div className="repo-columns">

        {/* SUMMARIES */}
        <div className="repo-col">
          <h2>Summaries</h2>
          {summariesData[type][detail].map((item) => (
            <div
              key={item}
              className="repo-item-selectable"
              onClick={() => toggleSummary(item)}
            >
              <div
                className={
                  selectedSummaries.includes(item)
                    ? "custom-box checked"
                    : "custom-box"
                }
              >
                {selectedSummaries.includes(item) && "✓"}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* TASKS */}
        <div className="repo-col">
          <h2>Tasks</h2>
          {tasksData[type][detail].map((item) => (
            <div
              key={item}
              className="repo-item-selectable"
              onClick={() => toggleTask(item)}
            >
              <div
                className={
                  selectedTasks.includes(item)
                    ? "custom-box checked"
                    : "custom-box"
                }
              >
                {selectedTasks.includes(item) && "✓"}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* TEMPLATES (Passive) */}
        <div className="repo-col">
          <h2>Templates</h2>
          {templatesData.map((temp) => (
            <div key={temp} className="repo-item">
              {temp}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
