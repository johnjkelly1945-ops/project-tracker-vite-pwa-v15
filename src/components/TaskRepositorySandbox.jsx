/* ======================================================================
   METRA - TaskRepositorySandbox.jsx
   Stage 2A + Logic Correction (Bundle → Summaries Only)
   ----------------------------------------------------------------------
   CHANGES IN THIS VERSION:
   • Stage-2A visual upgrades preserved exactly
   • CRITICAL FIX: Bundles NO LONGER reveal tasks automatically
       - Tasks now appear ONLY when summaries are ticked
       - Added guard inside visibleTaskIds for bundle summaries
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../Styles/TaskRepositorySandbox.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepositorySandbox({ onClose }) {

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
  const [selectedTasks,   setSelectedTasks]   = useState({});

  /* --------------------------------------------------------------
     FILTERED SUMMARIES / BUNDLES
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
     DETERMINE VISIBLE TASKS (Corrected Bundle Behaviour)
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    /* --------------------------------------------------------------
       1. Manual selections
       -------------------------------------------------------------- */
    Object.keys(selectedTasks).forEach(tid => {
      if (selectedTasks[tid]) collected.add(tid);
    });

    /* --------------------------------------------------------------
       2. Tasks from selected Summaries (unchanged)
       -------------------------------------------------------------- */
    Object.keys(selectedSummaries).forEach(sid => {
      if (!selectedSummaries[sid]) return;
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    /* --------------------------------------------------------------
       3. FIXED: Tasks from selected Bundles
          Bundles now reveal ONLY summaries, NOT tasks.
          Tasks appear only if the user TICKS a summary.
       -------------------------------------------------------------- */
    Object.keys(selectedBundles).forEach(bid => {
      if (!selectedBundles[bid]) return;

      const bundle = taskLibrary.bundles.find(b => b.id === bid);
      if (!bundle) return;

      // Direct bundle tasks (should be empty by METRA design)
      bundle.tasks?.forEach(tid => collected.add(tid));

      // *** CRITICAL FIX ***
      // Only add tasks from summaries IF summaries are selected by user
      bundle.summaries?.forEach(sid => {
        if (!selectedSummaries[sid]) return;  // <-- FIXED LINE
        const summary = taskLibrary.summaries.find(s => s.id === sid);
        summary?.tasks?.forEach(tid => collected.add(tid));
      });
    });

    return [...collected];

  }, [selectedSummaries, selectedBundles, selectedTasks]);


  /* ======================================================================
     RENDER START
     ====================================================================== */
  return (
    <div className="repo-overlay">
      <div className="repo-window">

        {/* ================================================================
            HEADER (Stage-2A)
           ================================================================ */}
        <div className="repo-header">
          <h2 className="repo-title">METRA Workspace Repository</h2>
          <button className="repo-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ================================================================
            FILTER BAR (unchanged)
           ================================================================ */}
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

        {/* ================================================================
            MAIN BODY (Stage-2A)
           ================================================================ */}
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

          {/* RIGHT PANE */}
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

        {/* FOOTER */}
        <div className="repo-footer">
          <button
            className="repo-add-btn"
            onClick={() => {
              const result = {
                summaries: Object.keys(selectedSummaries).filter(id => selectedSummaries[id]),
                bundles:   Object.keys(selectedBundles).filter(id => selectedBundles[id]),
                tasks:     Object.keys(selectedTasks).filter(id => selectedTasks[id]),
              };

              console.log("SANDBOX RESULT:", result);
              alert("Items sent to console. Sandbox resets.");

              setSelectedSummaries({});
              setSelectedBundles({});
              setSelectedTasks({});
            }}
          >
            Add Selected to Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
