/* ======================================================================
   METRA – TaskRepositorySandbox.jsx
   Safe Development Version – Stage 1 (Flat logic, clean selection model)
   ----------------------------------------------------------------------
   RULES IMPLEMENTED:
   • Selecting a bundle REVEALS its summaries & tasks, but does NOT check them
   • User may tick only the summaries/tasks they want
   • Collapsing a bundle hides all *unticked* summaries/tasks
   • Ticked items ALWAYS remain visible
   • “Download to Workspace” returns only ticked items
   • After download, resets to a clean state
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../Styles/TaskRepository.css";
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
     DETERMINE VISIBLE TASKS (FLAT LIST with persistent selections)
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    // 1. Manually selected tasks always remain visible
    Object.keys(selectedTasks).forEach(tid => {
      if (selectedTasks[tid]) collected.add(tid);
    });

    // 2. Tasks from selected Summaries
    Object.keys(selectedSummaries).forEach(sid => {
      if (!selectedSummaries[sid]) return;
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    // 3. Tasks from selected Bundles (direct + via summaries)
    Object.keys(selectedBundles).forEach(bid => {
      if (!selectedBundles[bid]) return;

      const bundle = taskLibrary.bundles.find(b => b.id === bid);
      if (!bundle) return;

      // Direct tasks
      bundle.tasks?.forEach(tid => collected.add(tid));

      // Tasks via summaries
      bundle.summaries?.forEach(sid => {
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

        {/* HEADER */}
        <div className="repo-header">
          <h2 className="repo-title">Task Repository — Sandbox</h2>
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

        {/* MAIN BODY */}
        <div className="repo-body">

          {/* --------------------------------------------------------------
              PANE 1 — Summaries + Bundles
             -------------------------------------------------------------- */}
          <div className="repo-pane repo-pane-left">
            
            <h3 className="repo-pane-title">Summaries</h3>
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

            <h3 className="repo-pane-title">Bundles</h3>
            <div className="repo-section">
              {filteredBundles.map(b => {
                const isOpen = !!selectedBundles[b.id];
                const bundleSummaries = taskLibrary.summaries.filter(s =>
                  b.summaries.includes(s.id)
                );

                return (
                  <div key={b.id} className="repo-bundle-block">

                    {/* BUNDLE CHECK */}
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

                    {/* Reveal summaries only when bundle selected */}
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

          {/* --------------------------------------------------------------
              PANE 2 — Tasks (Flat list, persistent selected)
             -------------------------------------------------------------- */}
          <div className="repo-pane repo-pane-right">
            <h3 className="repo-pane-title">Tasks</h3>

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

        </div> {/* END repo-body */}

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
