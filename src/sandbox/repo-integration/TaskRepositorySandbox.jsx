/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Stage 9.5.1 – Hierarchical Reveal (Robust Input Shape)
   ----------------------------------------------------------------------
   ✔ Bundles are structural only
   ✔ Summaries are potential workspace imports
   ✔ Tasks are potential children only
   ✔ Nothing commits until "Add Selected"
   ✔ Accepts repositoryData as ARRAY or OBJECT
   ====================================================================== */

import React, { useState } from "react";

export default function TaskRepositorySandbox({
  repositoryData,
  activePane,
  onExport,
  onClose
}) {
  /* ==============================================================
     NORMALISE INPUT SHAPE (CRITICAL FIX)
     ============================================================== */

  const bundles = Array.isArray(repositoryData)
    ? repositoryData
    : Array.isArray(repositoryData?.bundles)
    ? repositoryData.bundles
    : [];

  /* ==============================================================
     UI STATE (CANDIDATE ONLY)
     ============================================================== */

  const [openBundles, setOpenBundles] = useState({});
  const [openSummaries, setOpenSummaries] = useState({});
  const [candidateSummaries, setCandidateSummaries] = useState({});
  const [candidateTasks, setCandidateTasks] = useState({});

  /* ==============================================================
     TOGGLES
     ============================================================== */

  const toggleBundle = (bundleId) => {
    setOpenBundles((prev) => ({
      ...prev,
      [bundleId]: !prev[bundleId]
    }));
  };

  const toggleSummaryOpen = (summaryId) => {
    setOpenSummaries((prev) => ({
      ...prev,
      [summaryId]: !prev[summaryId]
    }));
  };

  const toggleSummaryCandidate = (summary) => {
    setCandidateSummaries((prev) => {
      const next = { ...prev };

      if (next[summary.id]) {
        delete next[summary.id];
      } else {
        next[summary.id] = summary;
        setOpenSummaries((o) => ({ ...o, [summary.id]: true }));
      }

      return next;
    });
  };

  const toggleTaskCandidate = (task, summary) => {
    setCandidateTasks((prev) => {
      const next = { ...prev };

      if (next[task.id]) {
        delete next[task.id];
      } else {
        next[task.id] = {
          ...task,
          repoSummaryId: summary.id
        };
      }

      return next;
    });
  };

  /* ==============================================================
     COMMIT GATE (ONLY COMMIT POINT)
     ============================================================== */

  const handleAddSelected = () => {
    if (
      !Object.keys(candidateSummaries).length &&
      !Object.keys(candidateTasks).length
    ) {
      return;
    }

    const summaries = Object.values(candidateSummaries).map((summary) => ({
      repoSummaryId: summary.id,
      title: summary.title,
      tasks: Object.values(candidateTasks).filter(
        (task) => task.repoSummaryId === summary.id
      )
    }));

    onExport({
      pane: activePane || "mgmt",
      summaries
    });

    setCandidateSummaries({});
    setCandidateTasks({});
    setOpenBundles({});
    setOpenSummaries({});
  };

  /* ==============================================================
     RENDER
     ============================================================== */

  return (
    <div className="task-repo-sandbox">
      <div className="repo-header">
        <h2>Repository</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="repo-body">
        {bundles.length === 0 && (
          <div style={{ padding: "12px", opacity: 0.7 }}>
            No repository bundles available
          </div>
        )}

        {bundles.map((bundle) => (
          <div key={bundle.id} className="repo-bundle">
            {/* === Bundle === */}
            <div className="repo-bundle-header">
              <input
                type="checkbox"
                checked={!!openBundles[bundle.id]}
                onChange={() => toggleBundle(bundle.id)}
              />
              <strong>{bundle.title}</strong>
            </div>

            {/* === Summaries === */}
            {openBundles[bundle.id] &&
              bundle.summaries?.map((summary) => (
                <div key={summary.id} className="repo-summary">
                  <div className="repo-summary-header">
                    <input
                      type="checkbox"
                      checked={!!candidateSummaries[summary.id]}
                      onChange={() => toggleSummaryCandidate(summary)}
                    />
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSummaryOpen(summary.id)}
                    >
                      {summary.title}
                    </span>
                  </div>

                  {/* === Tasks === */}
                  {openSummaries[summary.id] &&
                    summary.tasks?.map((task) => (
                      <div key={task.id} className="repo-task">
                        <input
                          type="checkbox"
                          checked={!!candidateTasks[task.id]}
                          onChange={() =>
                            toggleTaskCandidate(task, summary)
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
            !Object.keys(candidateSummaries).length &&
            !Object.keys(candidateTasks).length
          }
          onClick={handleAddSelected}
        >
          Add Selected (
          {Object.keys(candidateSummaries).length} summaries,
          {Object.keys(candidateTasks).length} tasks)
        </button>
      </div>
    </div>
  );
}
