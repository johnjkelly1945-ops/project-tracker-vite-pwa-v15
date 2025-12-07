/* ======================================================================
   METRA – TaskRepository.jsx (FINAL STABLE VERSION)
   ----------------------------------------------------------------------
   • Fully aligned with taskLibrary.js (type/method/scope/level/category)
   • No JSX errors, no duplicate wrappers
   • Dropdowns remain open while interacting
   • Pane 1 appears ONLY when all filters selected
   • Pane 2 appears ONLY when summaries/bundles selected
   • Tasks grouped into collapsible sections
   ====================================================================== */

import React, { useState, useMemo, useEffect, useRef } from "react";
import "../Styles/TaskRepository.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepository({ onClose, onAddToWorkspace }) {

  /* ======================================================================
     DROPDOWN COMPONENT
     ====================================================================== */
  function Dropdown({ id, label, value, options, openId, setOpenId, onSelect }) {
    const ref = useRef(null);

    useEffect(() => {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpenId(null);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [setOpenId]);

    const isOpen = openId === id;

    return (
      <div className="repo-dropdown" ref={ref}>
        <div
          className="repo-dropdown-trigger"
          onClick={() => setOpenId(isOpen ? null : id)}
        >
          {value ? `${label}: ${value} ▾` : `${label} ▾`}
        </div>

        {isOpen && (
          <div className="repo-dropdown-menu">
            {options.map(opt => (
              <div
                key={opt}
                className="repo-dropdown-item"
                onClick={() => {
                  onSelect(opt);
                  setOpenId(null);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ======================================================================
     FILTER STATE
     ====================================================================== */
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [search, setSearch] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null);

  const allFiltersSet =
    typeFilter && methodFilter && scopeFilter && levelFilter;

  /* ======================================================================
     USER SELECTION STATE
     ====================================================================== */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* ======================================================================
     FILTER SUMMARIES / BUNDLES
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
     DETERMINE TASKS FOR PANE 2
     ====================================================================== */
  const visibleTaskIds = useMemo(() => {
    const anySelection =
      Object.values(selectedSummaries).some(v => v) ||
      Object.values(selectedBundles).some(v => v);

    if (!anySelection) return [];

    const collected = new Set();

    // From summaries
    Object.keys(selectedSummaries).forEach(sumId => {
      if (selectedSummaries[sumId]) {
        const summary = taskLibrary.summaries.find(s => s.id === sumId);
        summary?.tasks?.forEach(tid => collected.add(tid));
      }
    });

    // From bundles (direct + via summaries)
    Object.keys(selectedBundles).forEach(bid => {
      if (selectedBundles[bid]) {
        const bundle = taskLibrary.bundles.find(b => b.id === bid);

        bundle?.tasks?.forEach(tid => collected.add(tid));

        bundle?.summaries?.forEach(sid => {
          const summary = taskLibrary.summaries.find(s => s.id === sid);
          summary?.tasks?.forEach(tid => collected.add(tid));
        });
      }
    });

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
     COLLAPSIBLE GROUPS
     ====================================================================== */
  const [openGroups, setOpenGroups] = useState({
    "Initiation": false,
    "Governance Setup": false,
    "Programme Definition": false,
    "Other": false
  });

  function toggleGroup(group) {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  }

  /* ======================================================================
     RENDER START
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
            <Dropdown
              id="type"
              label="Type"
              value={typeFilter}
              options={["Mgmt", "Dev"]}
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              onSelect={setTypeFilter}
            />
            <Dropdown
              id="method"
              label="Method"
              value={methodFilter}
              options={["PRINCE2", "MSP", "Generic"]}
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              onSelect={setMethodFilter}
            />
            <Dropdown
              id="scope"
              label="Scope"
              value={scopeFilter}
              options={["Software", "Transformation"]}
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              onSelect={setScopeFilter}
            />
            <Dropdown
              id="level"
              label="Level"
              value={levelFilter}
              options={["Project", "Programme"]}
              openId={openDropdown}
              setOpenId={setOpenDropdown}
              onSelect={setLevelFilter}
            />

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

          {/* PANE 1 — SUMMARIES + BUNDLES */}
          <div className="repo-pane repo-pane-left">
            <h3 className="repo-pane-title">Summaries</h3>

            <div className="repo-section">
              {allFiltersSet && filteredSummaries.length === 0 && (
                <p className="repo-empty">No summaries match filter.</p>
              )}

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
              {allFiltersSet && filteredBundles.length === 0 && (
                <p className="repo-empty">No bundles match filter.</p>
              )}

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

          {/* PANE 2 — TASKS */}
          <div className="repo-pane repo-pane-right">
            <h3 className="repo-pane-title">Tasks</h3>

            {/* Case 1 — Filters not selected */}
            {!allFiltersSet && (
              <p className="repo-empty">Select Type, Method, Scope and Level to begin.</p>
            )}

            {/* Case 2 — Filters selected but no summaries/bundles */}
            {allFiltersSet &&
             !Object.values(selectedSummaries).some(v => v) &&
             !Object.values(selectedBundles).some(v => v) && (
              <p className="repo-empty">Select a Summary or Bundle to see tasks.</p>
            )}

            {/* Case 3 — Show tasks */}
            {allFiltersSet &&
             (Object.values(selectedSummaries).some(v => v) ||
              Object.values(selectedBundles).some(v => v)) && (
              <div className="repo-task-groups">

                {/* Group builder */}
                {["Initiation", "Governance Setup", "Programme Definition", "Other"].map(group => {
                  const groupTasks = visibleTaskIds
                    .map(id => taskLibrary.tasks.find(t => t.id === id))
                    .filter(t => t && (t.category === group || (group === "Other" && !["Initiation", "Governance Setup", "Programme Definition"].includes(t.category))));

                  return (
                    <div key={group} className="repo-task-group">
                      <div
                        className="repo-task-group-header"
                        onClick={() => toggleGroup(group)}
                      >
                        {openGroups[group] ? "▾" : "▸"} {group}
                      </div>

                      {openGroups[group] && (
                        <div className="repo-task-group-body">
                          {groupTasks.map(t => (
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
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
