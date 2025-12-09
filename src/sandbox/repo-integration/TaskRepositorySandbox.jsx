/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Stage-3B – Corrected Export Logic (Only Checked Tasks)
   ----------------------------------------------------------------------
   RULES (Locked):
   • Selecting a bundle REVEALS its summaries only (never selects tasks)
   • Selecting a summary REVEALS its tasks, but does NOT select them
   • User may independently tick summaries/tasks they want
   • Only *checked* summaries and *checked* tasks are exported
   • Collapsing a bundle hides all *unticked* children
   • Ticked items ALWAYS remain visible
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "./TaskRepositorySandbox.css";           // Local sandbox CSS
import { taskLibrary } from "../../taskLibrary.js";

export default function TaskRepositorySandbox({ onClose }) {

  /* --------------------------------------------------------------
     FILTER BAR STATE
     -------------------------------------------------------------- */
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const allFiltersSet =
    typeFilter && methodFilter && scopeFilter && levelFilter;

  /* --------------------------------------------------------------
     USER SELECTION STATE
     -------------------------------------------------------------- */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* --------------------------------------------------------------
     FILTERED LIBRARY DATA
     -------------------------------------------------------------- */
  const filteredSummaries = useMemo(() => {
    if (!allFiltersSet) return [];
    return taskLibrary.summaries.filter(s =>
      s.type   === typeFilter &&
      s.method === methodFilter &&
      s.scope  === scopeFilter &&
      s.level  === levelFilter
    );
  }, [typeFilter, methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  const filteredBundles = useMemo(() => {
    if (!allFiltersSet) return [];
    return taskLibrary.bundles.filter(b =>
      b.type   === typeFilter &&
      b.method === methodFilter &&
      b.scope  === scopeFilter &&
      b.level  === levelFilter
    );
  }, [typeFilter, methodFilter, scopeFilter, levelFilter, allFiltersSet]);


  /* ======================================================================
     DETERMINE VISIBLE TASKS
     (Visible ≠ Selected — this ONLY controls display)
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    // 1. Tasks from manually checked tasks
    Object.keys(selectedTasks).forEach(tid => {
      if (selectedTasks[tid]) collected.add(tid);
    });

    // 2. Tasks from selected summaries
    Object.keys(selectedSummaries).forEach(sid => {
      if (!selectedSummaries[sid]) return;
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    // 3. Bundles → reveal summaries only (no direct tasks automatically)
    // KEEPING REVEAL-ONLY LOGIC: bundles do NOT auto-reveal tasks

    return [...collected];
  }, [selectedSummaries, selectedTasks]);


  /* ======================================================================
   CORRECTED EXPORT – summaries no longer export full task lists
   AND tasks now include summaryId for correct workspace grouping
   ====================================================================== */

const handleExport = () => {

  /* --------------------------------------------------------------
     EXPORT SUMMARIES (ONLY CHECKED)
     -------------------------------------------------------------- */
  const exportSummaries = Object.keys(selectedSummaries)
    .filter(id => selectedSummaries[id])
    .map(id => {
      const s = taskLibrary.summaries.find(x => x.id === id);

      return {
        id: s.id,
        name: s.name,
        method: s.method,
        scope: s.scope,
        level: s.level,
        type: s.type,
        tasks: []   // IMPORTANT: leave empty so importer relies ONLY on checked tasks
      };
    });


  /* --------------------------------------------------------------
     EXPORT TASKS (ONLY CHECKED + INCLUDE summaryId)
     -------------------------------------------------------------- */
  const exportTasks = Object.keys(selectedTasks)
    .filter(id => selectedTasks[id])
    .map(id => {
      const t = taskLibrary.tasks.find(x => x.id === id);

      // Find which summary this task belongs to
      const parentSummary = taskLibrary.summaries.find(s =>
        s.tasks.includes(t.id)
      );

      return {
        ...t,
        summaryId: parentSummary ? parentSummary.id : null
      };
    });


  /* --------------------------------------------------------------
     FINAL PAYLOAD
     -------------------------------------------------------------- */
  const payload = {
    type: typeFilter,
    summaries: exportSummaries,
    tasks: exportTasks
  };

  console.log("📦 EXPORTING FROM REPOSITORY SANDBOX (FINAL FIX):", payload);


  /* --------------------------------------------------------------
     DISPATCH TO WORKSPACE IMPORTER
     -------------------------------------------------------------- */
  window.dispatchEvent(
    new CustomEvent("repoIntegrationImport", { detail: payload })
  );


  /* --------------------------------------------------------------
     RESET STATE
     -------------------------------------------------------------- */
  alert("Exported to Repo Integration Sandbox");

  setSelectedSummaries({});
  setSelectedBundles({});
  setSelectedTasks({});
};



  /* ======================================================================
     RENDER START
     ====================================================================== */
  return (
    <div className="repo-overlay">
      <div className="repo-window">

        {/* HEADER */}
        <div className="repo-header">
          <h2 className="repo-title">METRA Workspace Repository</h2>
          <button className="repo-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FILTER BAR */}
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
            </select>
          </div>
        </div>

        {/* BODY */}
        <div className="repo-body">

          {/* LEFT PANE */}
          <div className="repo-pane repo-pane-left">

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

            <div className="repo-section-header">Bundles</div>
            <div className="repo-section">
              {filteredBundles.map(b => {
                const isOpen = !!selectedBundles[b.id];
                const summariesInBundle = taskLibrary.summaries.filter(s =>
                  b.summaries.includes(s.id)
                );

                return (
                  <div key={b.id} className="repo-bundle-block">

                    {/* Bundle Check */}
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

                    {/* Reveal summaries only */}
                    {isOpen && (
                      <div className="repo-bundle-children">
                        {summariesInBundle.map(s => (
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

          {/* RIGHT PANE: TASKS */}
          <div className="repo-pane repo-pane-right">

            <div className="repo-section-header">Tasks</div>

            <div className="repo-section">
              {visibleTaskIds.length === 0 && (
                <p className="repo-empty">No tasks available.</p>
              )}

              {visibleTaskIds.map(id => {
                const t = taskLibrary.tasks.find(t => t.id === id);
                if (!t) return null;

                return (
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
                );
              })}
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="repo-footer">
          <button className="repo-add-btn" onClick={handleExport}>
            Add Selected to Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
