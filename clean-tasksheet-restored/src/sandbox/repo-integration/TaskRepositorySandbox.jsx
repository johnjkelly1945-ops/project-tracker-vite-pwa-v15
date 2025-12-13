/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Stage 6.9 – FINAL FIX (Summary Selection Wired Correctly)
   ====================================================================== */

import React, { useState, useMemo } from "react";
import { adaptRepoPayload } from "/src/utils/repo/repoPayloadAdapter.js";

export default function TaskRepositorySandbox({
  repositoryData,
  activePane,
  onExport,
  onClose
}) {
  /* --------------------------------------------------------------
     DEFENSIVE NORMALISATION
     -------------------------------------------------------------- */
  const safeRepositoryData = Array.isArray(repositoryData)
    ? repositoryData
    : [];

  const [openBundles, setOpenBundles] = useState({});
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* --------------------------------------------------------------
     TOGGLES
     -------------------------------------------------------------- */
  const toggleBundle = (bundleId) => {
    setOpenBundles((prev) => ({ ...prev, [bundleId]: !prev[bundleId] }));
  };

  const toggleSummary = (summary) => {
    setSelectedSummaries((prev) => {
      const next = { ...prev };
      if (next[summary.id]) {
        delete next[summary.id];
      } else {
        next[summary.id] = summary;
      }
      return next;
    });
  };

  const toggleTask = (task) => {
    setSelectedTasks((prev) => {
      const next = { ...prev };
      if (next[task.id]) {
        delete next[task.id];
      } else {
        next[task.id] = task;
      }
      return next;
    });
  };

  /* --------------------------------------------------------------
     PAYLOAD
     -------------------------------------------------------------- */
  const preparedPayload = useMemo(() => {
    return adaptRepoPayload({
      pane: activePane,
      summaries: Object.values(selectedSummaries),
      tasks: Object.values(selectedTasks)
    });
  }, [activePane, selectedSummaries, selectedTasks]);

  const handleExport = () => {
    if (!activePane) {
      alert("No target pane selected.");
      return;
    }

    if (
      preparedPayload.summaries.length === 0 &&
      preparedPayload.tasks.length === 0
    ) {
      alert("Nothing selected to import.");
      return;
    }

    if (preparedPayload.hasDuplicates) {
      alert("Duplicate summaries or tasks detected. Import blocked.");
      return;
    }

    onExport(preparedPayload);
  };

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <div className="task-repo-sandbox">
      <div className="repo-header">
        <h3>Repository</h3>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="repo-body">
        {safeRepositoryData.map((bundle) => {
          const summaries = Array.isArray(bundle.summaries)
            ? bundle.summaries
            : [];
          const tasks = Array.isArray(bundle.tasks)
            ? bundle.tasks
            : [];

          return (
            <div key={bundle.id} className="repo-bundle">
              <div className="repo-bundle-row">
                <input
                  type="checkbox"
                  checked={!!openBundles[bundle.id]}
                  onChange={() => toggleBundle(bundle.id)}
                />
                <span>{bundle.title}</span>
              </div>

              {openBundles[bundle.id] && (
                <div className="repo-bundle-contents">
                  {summaries.map((s) => (
                    <label key={s.id} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        checked={!!selectedSummaries[s.id]}
                        onChange={() => toggleSummary(s)}
                      />
                      {s.title}
                    </label>
                  ))}

                  {tasks.map((t) => (
                    <label key={t.id} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        checked={!!selectedTasks[t.id]}
                        onChange={() => toggleTask(t)}
                      />
                      {t.title}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="repo-footer">
        <button onClick={handleExport}>
          Add Selected ({preparedPayload.summaries.length} summaries,{" "}
          {preparedPayload.tasks.length} tasks)
        </button>
      </div>
    </div>
  );
}
