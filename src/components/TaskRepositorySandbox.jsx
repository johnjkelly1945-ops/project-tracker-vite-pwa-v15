/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   FINAL LOGIC-CORRECT VERSION (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Filters determine *available* items, not visibility of tasks
   ✔ Tasks appear ONLY when a summary is checked
   ✔ Bundles reveal summaries (no task auto-reveal)
   ✔ Export = checked summaries + checked tasks only
   ✔ Bundles are NEVER exported
   ✔ Type (Mgmt/Dev) is included in export payload
   ✔ Fully compatible with RepoIntegrationApp and RepoIntegrationDualPane
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../sandbox/repo-integration/TaskRepositorySandbox.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepositorySandbox({ onClose, onAddToWorkspace }) {

  /* --------------------------------------------------------------
     FILTER STATE
     -------------------------------------------------------------- */
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const allFiltersSet =
    typeFilter && methodFilter && scopeFilter && levelFilter;

  /* --------------------------------------------------------------
     SELECTION STATE
     -------------------------------------------------------------- */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* --------------------------------------------------------------
     FILTERED SUMMARIES & BUNDLES
     -------------------------------------------------------------- */
  const filteredSummaries = useMemo(() => {
    if (!allFiltersSet) return [];
    return taskLibrary.summaries.filter(s =>
      s.type === typeFilter &&
      s.method === methodFilter &&
      s.scope === scopeFilter &&
      s.level === levelFilter
    );
  }, [typeFilter, methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  const filteredBundles = useMemo(() => {
    if (!allFiltersSet) return [];
    return taskLibrary.bundles.filter(b =>
      b.type === typeFilter &&
      b.method === methodFilter &&
      b.scope === scopeFilter &&
      b.level === levelFilter
    );
  }, [typeFilter, methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  /* ======================================================================
     TASK VISIBILITY LOGIC (CORRECT METRA BEHAVIOUR)
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    // Tasks manually checked
    Object.entries(selectedTasks).forEach(([tid, val]) => {
      if (val) collected.add(tid);
    });

    // Tasks from checked summaries
    Object.entries(selectedSummaries).forEach(([sid, isChecked]) => {
      if (!isChecked) return;
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    // Bundles → reveal summaries only, no task auto-reveal
    Object.entries(selectedBundles).forEach(([bid, isOpen]) => {
      if (!isOpen) return;

      const bundle = taskLibrary.bundles.find(b => b.id === bid);
      if (!bundle) return;

      // If summary under bundle is checked, reveal its tasks
      bundle.summaries.forEach(sid => {
        if (!selectedSummaries[sid]) return;
        const summary = taskLibrary.summaries.find(s => s.id === sid);
        summary?.tasks?.forEach(tid => collected.add(tid));
      });
    });

    return [...collected];
  }, [selectedSummaries, selectedBundles, selectedTasks]);

  /* ======================================================================
     EXPORT HANDLER
     ====================================================================== */
  const handleExport = () => {
    const summariesToExport = Object.keys(selectedSummaries)
      .filter(id => selectedSummaries[id]);

    const tasksToExport = Object.keys(selectedTasks)
      .filter(id => selectedTasks[id]);

    const payload = {
      type: typeFilter,             // "Mgmt" or "Dev"
      summaries: summariesToExport,
      tasks: tasksToExport,
      bundles: []                   // Bundles are not exported
    };

    console.log("📤 EXPORT PAYLOAD:", payload);

    if (onAddToWorkspace) {
      onAddToWorkspace(payload);
    }

    setSelectedSummaries({});
    setSelectedTasks({});
    setSelectedBundles({});
    onClose();
  };

  /* ======================================================================
     RENDER
     ====================================================================== */
  return (
    <div className="repo-overlay">
      <div className="repo-window">

        {/* HEADER --------------------------------------------------------- */}
        <div className="repo-header">
          <h2 className="repo-title">METRA Repository (Sandbox)</h2>
          <button className="repo-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FILTER BAR ----------------------------------------------------- */}
        <div className="repo-filterbar">
          <div className="repo-filterbar-row labels">
            <span>Type</span>
            <span>Method</span>
            <span>Scope</span>
            <span>Level</span>
          </div>

          <div className="repo-filterbar-row controls">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">Type</option>
              <option value="Mgmt">Mgmt</option>
              <option value="Dev">Dev</option>
            </select>

            <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="">Method</option>
              <option value="PRINCE2">PRINCE2</option>
              <option value="MSP">MSP</option>
              <option value="Generic">Generic</option>
            </select>

            <select value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}>
              <option value="">Scope</option>
              <option value="Software">Software</option>
              <option value="Transformation">Transformation</option>
            </select>

            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="">Level</option>
              <option value="Project">Project</option>
              <option value="Programme">Programme</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>

        {/* BODY ----------------------------------------------------------- */}
        <div className="repo-body">

          {/* LEFT PANE – SUMMARIES + BUNDLES ----------------------------- */}
          <div className="repo-pane repo-pane-left">

            {/* SUMMARIES */}
            <div className="repo-section-header">Summaries</div>
            <div className="repo-section">
              {filteredSummaries.map(s => (
                <label key={s.id} className="repo-item">
                  <input
                    type="checkbox"
                    checked={!!selectedSummaries[s.id]}
                    onChange={e =>
                      setSelectedSummaries(prev => ({
                        ...prev,
                        [s.id]: e.target.checked
                      }))
                    }
                  />
                  {s.name}
                </label>
              ))}
            </div>

            {/* BUNDLES */}
            <div className="repo-section-header">Bundles</div>
            <div className="repo-section">
              {filteredBundles.map(b => {
                const isOpen = !!selectedBundles[b.id];
                const bundleSummaries = taskLibrary.summaries.filter(s =>
                  b.summaries.includes(s.id)
                );

                return (
                  <div key={b.id} className="repo-bundle-block">

                    <label className="repo-item">
                      <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={e =>
                          setSelectedBundles(prev => ({
                            ...prev,
                            [b.id]: e.target.checked
                          }))
                        }
                      />
                      {b.name}
                    </label>

                    {isOpen && (
                      <div className="repo-bundle-children">
                        {bundleSummaries.map(s => (
                          <label key={s.id} className="repo-item child">
                            <input
                              type="checkbox"
                              checked={!!selectedSummaries[s.id]}
                              onChange={e =>
                                setSelectedSummaries(prev => ({
                                  ...prev,
                                  [s.id]: e.target.checked
                                }))
                              }
                            />
                            {s.name}
                          </label>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT PANE – TASKS ----------------------------------------- */}
          <div className="repo-pane repo-pane-right">
            <div className="repo-section-header">Tasks</div>

            <div className="repo-section">
              {visibleTaskIds.length === 0 && (
                <p className="repo-empty">No tasks available.</p>
              )}

              {visibleTaskIds
                .map(id => taskLibrary.tasks.find(t => t.id === id))
                .filter(Boolean)
                .map(t => (
                  <label key={t.id} className="repo-item">
                    <input
                      type="checkbox"
                      checked={!!selectedTasks[t.id]}
                      onChange={e =>
                        setSelectedTasks(prev => ({
                          ...prev,
                          [t.id]: e.target.checked
                        }))
                      }
                    />
                    {t.name}
                  </label>
                ))}
            </div>
          </div>

        </div>

        {/* FOOTER -------------------------------------------------------- */}
        <div className="repo-footer">
          <button className="repo-add-btn" onClick={handleExport}>
            Add Selected to Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
