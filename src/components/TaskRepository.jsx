/* ======================================================================
   METRA – TaskRepository.jsx
   Baseline Restore (2025-12-07-taskrepo-stable-v1)
   ----------------------------------------------------------------------
   ✔ Browser loads correctly
   ✔ Dropdowns work (close on click)
   ✔ Pane 1 shows Summaries + Bundles
   ✔ Pane 2 shows tasks (flat, ungrouped)
   ✔ No nested wrappers, no stray </div>
   ✔ No collapsible groups
   ✔ No auto-select bundle logic
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../Styles/TaskRepository.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepository({ onClose, onAddToWorkspace }) {

  /* ======================================================================
     FILTER STATE
     ====================================================================== */
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [search, setSearch] = useState("");

  const allFiltersSet =
    typeFilter && methodFilter && scopeFilter && levelFilter;

  /* ======================================================================
     USER SELECTION STATE
     ====================================================================== */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* ======================================================================
     FILTER SUMMARIES & BUNDLES
     ====================================================================== */
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
     DETERMINE VISIBLE TASKS (FLAT LIST)
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const activeSummaryIds = Object.keys(selectedSummaries).filter(id => selectedSummaries[id]);
    const activeBundleIds  = Object.keys(selectedBundles).filter(id => selectedBundles[id]);

    if (activeSummaryIds.length === 0 && activeBundleIds.length === 0) {
      return [];
    }

    const collected = new Set();

    // Tasks from summaries
    activeSummaryIds.forEach(sid => {
      const summary = taskLibrary.summaries.find(s => s.id === sid);
      summary?.tasks?.forEach(tid => collected.add(tid));
    });

    // Tasks from bundles
    activeBundleIds.forEach(bid => {
      const bundle = taskLibrary.bundles.find(b => b.id === bid);
      bundle?.tasks?.forEach(tid => collected.add(tid));
    });

    // Apply text search
    const searchLower = search.toLowerCase();

    return [...collected].filter(tid => {
      const t = taskLibrary.tasks.find(x => x.id === tid);
      if (!t) return false;
      return (
        !search ||
        t.name.toLowerCase().includes(searchLower) ||
        (t.description || "").toLowerCase().includes(searchLower)
      );
    });

  }, [selectedSummaries, selectedBundles, search]);

  /* ======================================================================
     RENDER
     ====================================================================== */
  return (
    <div className="repo-overlay">
      <div className="repo-window">

        {/* HEADER */}
        <div className="repo-header">
          <h2 className="repo-title">Task Repository</h2>
          <button className="repo-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* FILTER BAR */}
        <div className="repo-filterbar">
          <div className="repo-filterbar-row labels">
            <span>Type</span>
            <span>Method</span>
            <span>Scope</span>
            <span>Level</span>
            <span className="repo-search-label">Search</span>
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

            <input
              className="repo-search-input"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="repo-body">

          {/* PANE 1 — Summaries + Bundles */}
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

          {/* PANE 2 — Tasks (flat list) */}
          <div className="repo-pane repo-pane-right">
            <h3 className="repo-pane-title">Tasks</h3>

            {visibleTaskIds.length === 0 && (
              <p className="repo-empty">No tasks match selection.</p>
            )}

            <div className="repo-section">
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
                ))
              }
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="repo-footer">
          <button
            className="repo-add-btn"
            onClick={() => {
              onAddToWorkspace({
                summaries: Object.keys(selectedSummaries).filter(id => selectedSummaries[id]),
                bundles: Object.keys(selectedBundles).filter(id => selectedBundles[id]),
                tasks: Object.keys(selectedTasks).filter(id => selectedTasks[id])
              });
              onClose();
            }}
          >
            Add Selected to Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
