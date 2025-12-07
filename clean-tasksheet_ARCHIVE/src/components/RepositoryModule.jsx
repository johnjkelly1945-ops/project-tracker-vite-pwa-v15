/* ======================================================================
   METRA – RepositoryModule.jsx
   Stable summary/task typing + safe download
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/Repository.css";

export default function RepositoryModule({ setScreen, onDownload }) {

  const typeOptions = ["Management", "Development"];

  const detailOptions = {
    Management: ["Generic"],
    Development: ["Generic"]
  };

  const summariesData = {
    Management: {
      Generic: [
        "Project Management Summary",
        "Governance Summary",
        "Change Control Summary",
        "Delivery Assurance Summary"
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
    setSelectedSummaries(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const toggleTask = (name) => {
    setSelectedTasks(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const handleDownload = () => {
    const bundle = [
      ...selectedSummaries.map(name => ({
        id: Date.now() + Math.random(),
        title: name,
        type: "summary",
        expanded: false
      })),
      ...selectedTasks.map(name => ({
        id: Date.now() + Math.random(),
        title: name,
        type: "task",
        status: "Not Started"
      }))
    ];

    if (bundle.length === 0) {
      alert("No items selected.");
      return;
    }

    onDownload(bundle);
  };

  return (
    <div className="repository-wrapper">
      <div className="repo-header">
        <h1>Repository Task Selection</h1>
        <button className="repo-close" onClick={() => setScreen("preproject")}>✕</button>
      </div>

      <div className="filter-bar-unified">
        <div className="filter-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setDetail("Generic");
              setSelectedSummaries([]);
              setSelectedTasks([]);
            }}
          >
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Detail</label>
          <select
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setSelectedSummaries([]);
              setSelectedTasks([]);
            }}
          >
            {detailOptions[type].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <button className="download-btn" onClick={handleDownload}>
          Download Selected Tasks
        </button>
      </div>

      <div className="repo-columns">

        <div className="repo-col">
          <h2>Summaries</h2>
          {summariesData[type][detail].map(item => (
            <div key={item} className="repo-item-selectable" onClick={() => toggleSummary(item)}>
              <div className={selectedSummaries.includes(item) ? "custom-box checked" : "custom-box"}>
                {selectedSummaries.includes(item) && "✓"}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="repo-col">
          <h2>Tasks</h2>
          {tasksData[type][detail].map(item => (
            <div key={item} className="repo-item-selectable" onClick={() => toggleTask(item)}>
              <div className={selectedTasks.includes(item) ? "custom-box checked" : "custom-box"}>
                {selectedTasks.includes(item) && "✓"}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="repo-col">
          <h2>Templates</h2>
          {templatesData.map(temp => (
            <div key={temp} className="repo-item">{temp}</div>
          ))}
        </div>

      </div>
    </div>
  );
}
