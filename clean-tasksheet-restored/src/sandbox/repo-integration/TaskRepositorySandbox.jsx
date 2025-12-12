/* --- SANDBOX VERSION ----------------------------------------------
   File: src/components/TaskRepositorySandbox.jsx
   Used ONLY in RepoIntegrationApp (sandbox mode)
   Not part of the main METRA workspace repository
--------------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import "./TaskRepositorySandbox.css";
import { taskLibrary } from "../../sandbox/taskLibrarySandbox.js";

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
     METHOD OPTIONS BASED ON TYPE
     -------------------------------------------------------------- */
  const methodOptions = useMemo(() => {
    if (typeFilter === "Mgmt") return ["PRINCE2", "MSP", "Generic"];
    if (typeFilter === "Dev") return ["Agile"];
    return [];
  }, [typeFilter]);

  /* Reset method when type changes */
  const handleTypeChange = (value) => {
    setTypeFilter(value);
    setMethodFilter("");
  };

  /* --------------------------------------------------------------
     SELECTION STATE
     -------------------------------------------------------------- */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* --------------------------------------------------------------
     FILTERED SUMMARIES / BUNDLES
     -------------------------------------------------------------- */
  const filteredSummaries = useMemo(() => {
    if (!allFiltersSet) return [];

    return taskLibrary.filter(item =>
      item.type === "summary" &&
      item.method === methodFilter &&
      item.scope === scopeFilter &&
      item.level === levelFilter
    );
  }, [methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  const filteredBundles = useMemo(() => {
    if (!allFiltersSet) return [];

    return taskLibrary.filter(item =>
      item.type === "bundle" &&
      item.method === methodFilter &&
      item.scope === scopeFilter &&
      item.level === levelFilter
    );
  }, [methodFilter, scopeFilter, levelFilter, allFiltersSet]);

  /* --------------------------------------------------------------
     DETERMINE VISIBLE TASKS
     -------------------------------------------------------------- */
  const visibleTaskIds = useMemo(() => {
    const collected = new Set();

    Object.keys(selectedTasks).forEach(id => {
      if (selectedTasks[id]) collected.add(id);
    });

    Object.keys(selectedSummaries).forEach(sid => {
      if (!selectedSummaries[sid]) return;
      const summary = taskLibrary.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    Object.keys(selectedBundles).forEach(bid => {
      if (!selectedBundles[bid]) return;
      const bundle = taskLibrary.find(b => b.id === bid);
      if (!bundle) return;

      bundle.items.forEach(itemId => {
        const item = taskLibrary.find(i => i.id === itemId);
        if (!item) return;

        if (item.type === "summary" && selectedSummaries[item.id]) {
          item.tasks?.forEach(tid => collected.add(tid));
        }

        if (item.type === "task" && selectedTasks[item.id]) {
          collected.add(item.id);
        }
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

        <div className="repo-header">
          <h2 className="repo-title">METRA Workspace Repository (Sandbox)</h2>
          <button className="repo-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="repo-filterbar">
          <div className="repo-filterbar-row labels">
            <span>Type</span>
            <span>Method</span>
            <span>Scope</span>
            <span>Level</span>
          </div>

          <div className="repo-filterbar-row controls">
            <select value={typeFilter} onChange={e => handleTypeChange(e.target.value)}>
              <option value="">Type</option>
              <option value="Mgmt">Mgmt</option>
              <option value="Dev">Dev</option>
            </select>

            <select
              value={methodFilter}
              disabled={!typeFilter}
              onChange={e => setMethodFilter(e.target.value)}
            >
              <option value="">Method</option>
              {methodOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}>
              <option value="">Scope</option>
              <option value="Software">Software</option>
              <option value="Business">Business</option>
              <option value="Transformation">Transformation</option>
            </select>

            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
              <option value="">Level</option>
              <option value="Project">Project</option>
              <option value="Programme">Programme</option>
            </select>
          </div>
        </div>

        <div className="repo-body">
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
              {filteredBundles.map(b => (
                <label key={b.id} className="repo-item">
                  <input
                    type="checkbox"
                    checked={!!selectedBundles[b.id]}
                    onChange={e =>
                      setSelectedBundles(prev => ({
                        ...prev,
                        [b.id]: e.target.checked
                      }))
                    }
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          <div className="repo-pane repo-pane-right">
            <div className="repo-section-header">Tasks</div>
            <div className="repo-section">
              {visibleTaskIds.map(id => {
                const t = taskLibrary.find(item => item.id === id);
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

        <div className="repo-footer">
          <button
            className="repo-add-btn"
            onClick={() => {
              const payload = {
                type: typeFilter,
                summaries: Object.keys(selectedSummaries).filter(id => selectedSummaries[id]),
                bundles: Object.keys(selectedBundles).filter(id => selectedBundles[id]),
                tasks: Object.keys(selectedTasks).filter(id => selectedTasks[id])
              };

              console.log("📤 SANDBOX EXPORT PAYLOAD:", payload);

              if (onAddToWorkspace) onAddToWorkspace(payload);

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
