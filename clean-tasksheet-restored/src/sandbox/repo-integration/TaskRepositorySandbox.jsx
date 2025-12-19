/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Stage 11.0 – Deterministic Repository Sandbox (LIVE)
   ----------------------------------------------------------------------
   ✔ Renders bundles → summaries → tasks
   ✔ Selection + intent export only
   ✔ No workspace mutation
   ✔ No governance / popup / documents
   ====================================================================== */

import React, { useState } from "react";

export default function TaskRepositorySandbox({
  repositoryData,
  onExport,
  onClose
}) {
  console.log("🧪 LIVE TaskRepositorySandbox rendering", repositoryData);

  const bundles = repositoryData?.bundles || [];

  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  const toggleSummary = (summary) => {
    setSelectedSummaries((prev) => {
      const next = { ...prev };
      next[summary.id]
        ? delete next[summary.id]
        : (next[summary.id] = summary);
      return next;
    });
  };

  const toggleTask = (task, summaryId) => {
    setSelectedTasks((prev) => {
      const next = { ...prev };
      next[task.id]
        ? delete next[task.id]
        : (next[task.id] = { ...task, repoSummaryId: summaryId });
      return next;
    });
  };

  const handleExport = () => {
    const summaries = Object.values(selectedSummaries).map((s) => ({
      repoSummaryId: s.id,
      title: s.title,
      tasks: Object.values(selectedTasks).filter(
        (t) => t.repoSummaryId === s.id
      )
    }));

    onExport({ summaries });
  };

  return (
    <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
      <h2>Repository</h2>
      <button onClick={onClose}>Close</button>

      {bundles.length === 0 && (
        <div style={{ marginTop: "16px", opacity: 0.6 }}>
          No repository items available
        </div>
      )}

      {bundles.map((bundle) => (
        <div key={bundle.id} style={{ marginTop: "16px" }}>
          <strong>{bundle.title}</strong>

          {bundle.summaries.map((summary) => (
            <div key={summary.id} style={{ marginLeft: "16px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedSummaries[summary.id]}
                  onChange={() => toggleSummary(summary)}
                />
                {summary.title}
              </label>

              {summary.tasks.map((task) => (
                <div key={task.id} style={{ marginLeft: "16px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!selectedTasks[task.id]}
                      onChange={() => toggleTask(task, summary.id)}
                    />
                    {task.title}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleExport} style={{ marginTop: "24px" }}>
        Add Selected (
        {Object.keys(selectedSummaries).length} summaries,
        {Object.keys(selectedTasks).length} tasks)
      </button>
    </div>
  );
}
