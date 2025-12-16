/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Stage 8.3 – Deterministic Export Payload
   ----------------------------------------------------------------------
   ✔ Builds summary → task structure
   ✔ Emits Stage 8.3–compliant payload
   ✔ No repository or adapter changes
   ✔ UI behaviour unchanged
   ====================================================================== */

import React, { useState } from "react";

export default function TaskRepositorySandbox({
  repositoryData,
  activePane,
  onExport,
  onClose
}) {
  const bundles = repositoryData?.bundles || [];

  const [openBundles, setOpenBundles] = useState({});
  const [openSummaries, setOpenSummaries] = useState({});
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* ===================== TOGGLES ===================== */

  const toggleBundle = (id) => {
    setOpenBundles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSummaryOpen = (id) => {
    setOpenSummaries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSummarySelect = (summary) => {
    setSelectedSummaries((prev) => {
      const next = { ...prev };
      const isSelected = !!next[summary.id];

      if (isSelected) {
        delete next[summary.id];
      } else {
        next[summary.id] = summary;
        setOpenSummaries((o) => ({ ...o, [summary.id]: true }));
      }
      return next;
    });
  };

  const toggleTaskSelect = (task, summary) => {
    setSelectedTasks((prev) => {
      const next = { ...prev };
      next[task.id]
        ? delete next[task.id]
        : (next[task.id] = {
            ...task,
            repoSummaryId: summary.id
          });
      return next;
    });
  };

  /* ===================== EXPORT (FIXED) ===================== */

  const handleAddSelected = () => {
    if (
      !Object.keys(selectedSummaries).length &&
      !Object.keys(selectedTasks).length
    ) {
      return;
    }

    // Build deterministic summaries with nested tasks
    const summaries = Object.values(selectedSummaries).map((summary) => {
      return {
        repoSummaryId: summary.id,
        title: summary.title,
        tasks: Object.values(selectedTasks).filter(
          (task) => task.repoSummaryId === summary.id
        )
      };
    });

    onExport({
      pane: activePane || "mgmt",
      summaries
    });

    // Reset state
    setSelectedSummaries({});
    setSelectedTasks({});
    setOpenBundles({});
    setOpenSummaries({});
  };

  /* ============================ RENDER =========================== */

  return (
    <div className="task-repo-sandbox">
      <div className="repo-header">
        <h2>Repository</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="repo-body">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="repo-bundle">
            <div className="repo-bundle-header">
              <input
                type="checkbox"
                checked={!!openBundles[bundle.id]}
                onChange={() => toggleBundle(bundle.id)}
              />
              <strong>{bundle.title}</strong>
            </div>

            {openBundles[bundle.id] &&
              bundle.summaries.map((summary) => (
                <div key={summary.id} className="repo-summary">
                  <div className="repo-summary-header">
                    <input
                      type="checkbox"
                      checked={!!selectedSummaries[summary.id]}
                      onChange={() => toggleSummarySelect(summary)}
                    />
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSummaryOpen(summary.id)}
                    >
                      {summary.title}
                    </span>
                  </div>

                  {openSummaries[summary.id] &&
                    summary.tasks.map((task) => (
                      <div key={task.id} className="repo-task">
                        <input
                          type="checkbox"
                          checked={!!selectedTasks[task.id]}
                          onChange={() =>
                            toggleTaskSelect(task, summary)
                          }
                        />
                        {task.title}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="repo-footer">
        <button
          disabled={
            !Object.keys(selectedSummaries).length &&
            !Object.keys(selectedTasks).length
          }
          onClick={handleAddSelected}
        >
          Add Selected (
          {Object.keys(selectedSummaries).length} summaries,
          {Object.keys(selectedTasks).length} tasks)
        </button>
      </div>
    </div>
  );
}
