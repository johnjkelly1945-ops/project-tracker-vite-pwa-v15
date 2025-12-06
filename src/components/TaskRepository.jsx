/* ======================================================================
   METRA – TaskRepository.jsx
   FINAL TWO-COLUMN MODEL (Summaries + Bundles → Tasks)
   ----------------------------------------------------------------------
   • Column 1: Summaries + Bundles (checkbox selectable)
   • Column 2: Tasks (checkbox selectable)
   • Filters: Method, Project Type, Level, Search
   • No auto-selection – user explicitly chooses everything
   • Designed to integrate with DualPane via onSelect callback
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../Styles/TaskRepository.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepository({ onClose, onAddToWorkspace }) {

  /* -------------------------------------------------------------
     FILTER STATE
     ------------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  /* -------------------------------------------------------------
     SELECTION STATE (checkboxes)
     ------------------------------------------------------------- */
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* -------------------------------------------------------------
     FILTERED SUMMARIES
     ------------------------------------------------------------- */
  const filteredSummaries = useMemo(() => {
    return taskLibrary.summaries.filter(s => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchMethod =
        methodFilter === "All" || s.method === methodFilter;

      const matchType =
        typeFilter === "All" || s.projectType === typeFilter;

      const matchLevel =
        levelFilter === "All" || s.level === levelFilter;

      return matchSearch && matchMethod && matchType && matchLevel;
    });
  }, [search, methodFilter, typeFilter, levelFilter]);

  /* -------------------------------------------------------------
     FILTERED BUNDLES
     ------------------------------------------------------------- */
  const filteredBundles = useMemo(() => {
    return taskLibrary.bundles.filter(b => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());

      const matchMethod =
        methodFilter === "All" || b.method === methodFilter;

      const matchType =
        typeFilter === "All" || b.projectType === typeFilter;

      const matchLevel =
        levelFilter === "All" || b.level === levelFilter;

      return matchSearch && matchMethod && matchType && matchLevel;
    });
  }, [search, methodFilter, typeFilter, levelFilter]);

  /* -------------------------------------------------------------
     FILTERED TASKS
     ------------------------------------------------------------- */
  const filteredTasks = useMemo(() => {
    return taskLibrary.tasks.filter(t => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchMethod =
        methodFilter === "All" || t.method === methodFilter;

      const matchType =
        typeFilter === "All" || t.projectType === typeFilter;

      const matchLevel =
        levelFilter === "All" || t.level === levelFilter;

      return matchSearch && matchMethod && matchType && matchLevel;
    });
  }, [search, methodFilter, typeFilter, levelFilter]);

  /* -------------------------------------------------------------
     TASKS SHOWN IN COLUMN 2
     Based on:
       • tasks from selected summaries
       • tasks from selected bundles
       • OR filteredTasks if nothing selected
     ------------------------------------------------------------- */
  const tasksFromSelections = useMemo(() => {
    const collected = new Set();

    // Tasks from selected summaries
    Object.keys(selectedSummaries).forEach(sumId => {
      if (selectedSummaries[sumId]) {
        const summary = taskLibrary.summaries.find(s => s.id === sumId);
        summary?.tasks?.forEach(tid => collected.add(tid));
      }
    });

    // Tasks from selected bundles
    Object.keys(selectedBundles).forEach(bid => {
      if (selectedBundles[bid]) {
        const bundle = taskLibrary.bundles.find(b => b.id === bid);
        bundle?.tasks?.forEach(tid => collected.add(tid));
        bundle?.summaries?.forEach(sid => {
          const sum = taskLibrary.summaries.find(s => s.id === sid);
          sum?.tasks?.forEach(tid => collected.add(tid));
        });
      }
    });

    if (collected.size === 0) {
      // Nothing selected → show filteredTasks
      return filteredTasks;
    }

    // Convert collected IDs → full task objects
    return [...collected]
      .map(id => taskLibrary.tasks.find(t => t.id === id))
      .filter(Boolean);
  }, [
    selectedSummaries,
    selectedBundles,
    filteredTasks
  ]);

  /* -------------------------------------------------------------
     HANDLE ADD TO WORKSPACE
     ------------------------------------------------------------- */
  const handleAdd = () => {
    if (!onAddToWorkspace) return;

    const selectedSummaryIds = Object.keys(selectedSummaries).filter(id => selectedSummaries[id]);
    const selectedBundleIds = Object.keys(selectedBundles).filter(id => selectedBundles[id]);
    const selectedTaskIds = Object.keys(selectedTasks).filter(id => selectedTasks[id]);

    onAddToWorkspace({
      summaries: selectedSummaryIds,
      bundles: selectedBundleIds,
      tasks: selectedTaskIds
    });

    onClose();
  };

  /* -------------------------------------------------------------
     RENDER
     ------------------------------------------------------------- */
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
          <input
            className="repo-input"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
            <option>All</option>
            <option>PRINCE2</option>
            <option>MSP</option>
            <option>Generic</option>
          </select>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>All</option>
            <option>All</option>
            <option>Software</option>
            <option>Transformation</option>
          </select>

          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option>All</option>
            <option>Project</option>
            <option>Programme</option>
          </select>
        </div>

        {/* MAIN LAYOUT */}
        <div className="repo-body">

          {/* COLUMN 1: Summaries + Bundles */}
          <div className="repo-column1">
            <h3>Summaries</h3>
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

            <h3>Bundles</h3>
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

          {/* COLUMN 2: Tasks */}
          <div className="repo-column2">
            <h3>Tasks</h3>

            {tasksFromSelections.length === 0 && (
              <p className="repo-empty">No tasks available.</p>
            )}

            {tasksFromSelections.map(t => (
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

        {/* FOOTER BUTTON */}
        <div className="repo-footer">
          <button className="repo-add-btn" onClick={handleAdd}>
            Add Selected to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
