/* ======================================================================
   COMPONENTS – TaskRepositorySandbox.jsx
   Repo Sandbox (Components Version) – Clean, Stable, Updated Dec 2025
   ----------------------------------------------------------------------
   ✔ Mgmt + Dev filters correct
       - Mgmt Methods: PRINCE2 / MSP / Generic
       - Dev Methods: Agile only
   ✔ Bundles appear for Mgmt only
   ✔ Summaries appear for both Mgmt + Dev
   ✔ Tasks appear only when summaries are checked
   ✔ Export returns checked summaries + tasks (bundles not exported)
   ✔ No CSS path errors
   ====================================================================== */
import React, { useState, useMemo } from "react";
import "../Styles/TaskRepositorySandbox.css";
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
     FILTER OPTIONS – METHOD FILTER ADJUSTED FOR DEV
     -------------------------------------------------------------- */
  const methodOptions = useMemo(() => {
    if (typeFilter === "Dev") {
      return ["Agile"];     // Dev only uses Agile for now
    }
    return ["PRINCE2", "MSP", "Generic"];
  }, [typeFilter]);

  /* --------------------------------------------------------------
     SELECTION STATE
     -------------------------------------------------------------- */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks,   setSelectedTasks]   = useState({});

  /* --------------------------------------------------------------
     FILTERED SUMMARIES
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

  /* --------------------------------------------------------------
     FILTERED BUNDLES (Mgmt-only)
     -------------------------------------------------------------- */
  const filteredBundles = useMemo(() => {
    if (!allFiltersSet) return [];
    if (typeFilter !== "Mgmt") return [];  // Dev NEVER shows bundles

    return taskLibrary.bundles.filter(b =>
      b.type   === typeFilter &&
      b.method === methodFilter &&
      b.scope  === scopeFilter &&
      b.level  === levelFilter
    );
  }, [typeFilter, methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  /* ======================================================================
     DETERMINE VISIBLE TASKS
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    // Tasks manually selected
    Object.keys(selectedTasks).forEach(tid => {
      if (selectedTasks[tid]) collected.add(tid);
    });

    // Tasks from selected summaries
    Object.keys(selectedSummaries).forEach(sid => {
      if (!selectedSummaries[sid]) return;
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    // Bundles → reveal summaries, tasks only if summaries are ticked
    Object.keys(selectedBundles).forEach(bid => {
      if (!selectedBundles[bid]) return;
      const bundle = taskLibrary.bundles.find(b => b.id === bid);
      if (!bundle) return;

      bundle.summaries?.forEach(sid => {
        if (!selectedSummaries[sid]) return;
        const summary = taskLibrary.summaries.find(s => s.id === sid);
        summary?.tasks?.forEach(tid => collected.add(tid));
      });
    });

    return [...collected];
  }, [selectedSummaries, selectedBundles, selectedTasks]);

  /* ======================================================================
     RENDER
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
            {/* TYPE */}
            <select value={typeFilter} onChange={e => {
              setTypeFilter(e.target.value);
              setMethodFilter("");     // reset method each time type changes
            }}>
              <option value="">Type</option>
              <option value="Mgmt">Mgmt</option>
              <option value="Dev">Dev</option>
            </select>

            {/* METHOD (changes based on Type) */}
            <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="">Method</option>
              {methodOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* SCOPE */}
            <select value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}>
              <option value="">Scope</option>
              <option value="Software">Software</option>
              <option value="Transformation">Transformation</option>
            </select>

            {/* LEVEL */}
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="">Level</option>
              <option value="Project">Project</option>
              <option value="Programme">Programme</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="repo-body">

          {/* LEFT PANE – SUMMARIES + BUNDLES */}
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

            {/* BUNDLES (Mgmt only) */}
            {typeFilter === "Mgmt" && (
              <>
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
              </>
            )}

          </div>

          {/* RIGHT PANE – TASKS */}
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
              const payload = {
                summaries: Object.keys(selectedSummaries).filter(id => selectedSummaries[id]),
                tasks:     Object.keys(selectedTasks).filter(id => selectedTasks[id]),
                type:      typeFilter
              };

              console.log("📤 EXPORT PAYLOAD:", payload);

              if (onAddToWorkspace) {
                onAddToWorkspace(payload);
              }

              // Reset
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
