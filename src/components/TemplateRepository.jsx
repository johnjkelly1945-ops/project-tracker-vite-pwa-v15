/* ======================================================================
   METRA – TaskRepository.jsx
   Stage 3 – Fully Functional Repository (Summaries, Bundles, Tasks)
   ----------------------------------------------------------------------
   • Left Panel: Summaries + Bundles (both expanded by default)
   • Middle Panel: Tasks matching selections
   • Right Panel: Add-to-Workspace action
   • Filters: Method, Project Type, Search
   • Selection auto-clears if filters change (governance-safe)
   • Grouped vs Flat task view (Rule C):
        - If summaries selected → grouped
        - If only tasks → flat
   • Works with minimal taskLibrary M1
   ====================================================================== */

import React, { useState, useMemo, useEffect } from "react";
import "../Styles/TaskRepository.css";
import { taskLibrary } from "../taskLibrary.js";

export default function TaskRepository({ onClose, onSelectItem }) {

  /* ================================================================
     FILTER STATE (RESET SELECTIONS WHEN ANY CHANGE OCCURS)
     ================================================================ */
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  /* ================================================================
     LEFT COLUMN SELECTION STATE
     ================================================================ */
  const [selectedSummaries, setSelectedSummaries] = useState([]);  // summary IDs
  const [selectedBundles, setSelectedBundles] = useState([]);      // bundle IDs

  /* ================================================================
     TASK SELECTION STATE (ONLY user-selected, not auto-generated)
     ================================================================ */
  const [selectedTasks, setSelectedTasks] = useState([]);          // task IDs

  /* ================================================================
     COLLAPSIBLE SECTIONS (expanded by default)
     ================================================================ */
  const [showSummaries, setShowSummaries] = useState(true);
  const [showBundles, setShowBundles] = useState(true);

  /* ================================================================
     FILTERED BASE LISTS
     ================================================================ */
  const filteredManagement = useMemo(() => {
    return taskLibrary.management.filter(item => {
      const textMatch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const methodMatch =
        methodFilter === "All" || item.method === methodFilter;

      const typeMatch =
        typeFilter === "All" || item.projectType === typeFilter;

      return textMatch && methodMatch && typeMatch;
    });
  }, [search, methodFilter, typeFilter]);

  const filteredDevelopment = useMemo(() => {
    return taskLibrary.development.filter(item => {
      const textMatch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const methodMatch =
        methodFilter === "All" || item.method === methodFilter;

      const typeMatch =
        typeFilter === "All" || item.projectType === typeFilter;

      return textMatch && methodMatch && typeMatch;
    });
  }, [search, methodFilter, typeFilter]);

  const filteredBundles = useMemo(() => {
    return taskLibrary.bundles.filter(bundle => {
      const textMatch =
        !search ||
        bundle.name.toLowerCase().includes(search.toLowerCase()) ||
        bundle.description.toLowerCase().includes(search.toLowerCase());

      const methodMatch =
        methodFilter === "All" || bundle.method === methodFilter;

      const typeMatch =
        typeFilter === "All" || bundle.projectType === typeFilter;

      return textMatch && methodMatch && typeMatch;
    });
  }, [search, methodFilter, typeFilter]);


  /* ================================================================
     AUTO-CLEAR selections when filters change (Option B)
     ================================================================ */
  useEffect(() => {
    setSelectedSummaries([]);
    setSelectedBundles([]);
    setSelectedTasks([]);
  }, [search, methodFilter, typeFilter]);


  /* ================================================================
     COLUMN 1: SUMMARIES (M1 uses management list only)
     Summaries = management tasks only (for now)
     ================================================================ */
  const summaries = filteredManagement.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description
  }));


  /* ================================================================
     COLUMN 1: BUNDLES (simple bundles referencing task IDs)
     ================================================================ */
  const bundles = filteredBundles;


  /* ================================================================
     COLUMN 2: BUILD TASK LIST BASED ON SELECTIONS
     ================================================================ */

  // All tasks indexed by ID for lookup
  const taskIndex = useMemo(() => {
    const index = {};
    [...taskLibrary.management, ...taskLibrary.development].forEach(t => {
      index[t.id] = t;
    });
    return index;
  }, []);

  // Summaries → tasks belonging to that summary (M1: none yet)
  const summaryTaskMap = useMemo(() => {
    // In M1, summaries have no inner tasks.
    // This will expand when METRA introduces summary-task relationships.
    return {};
  }, []);

  // Bundles → tasks referenced by the bundle
  const bundleTaskMap = useMemo(() => {
    const map = {};
    bundles.forEach(bundle => {
      map[bundle.id] = bundle.items.map(id => taskIndex[id]).filter(Boolean);
    });
    return map;
  }, [bundles, taskIndex]);


  /* ================================================================
     APPLY RULE C FOR COLUMN 2:
     - If summaries selected → grouped list (group by summary)
     - Else if bundles selected → flat task list of their tasks
     - Else if tasks manually selected → flat list
     ================================================================ */
  let groupedTasks = {};
  let flatTasks = [];

  if (selectedSummaries.length > 0) {
    // GROUPED VIEW
    selectedSummaries.forEach(sumID => {
      groupedTasks[sumID] = summaryTaskMap[sumID] || [];
    });
  } else if (selectedBundles.length > 0) {
    // FLAT VIEW from bundles
    selectedBundles.forEach(bid => {
      const tasks = bundleTaskMap[bid] || [];
      tasks.forEach(t => {
        if (!flatTasks.find(x => x.id === t.id)) {
          flatTasks.push(t);
        }
      });
    });
  } else {
    // Manual task selection only → flat
    selectedTasks.forEach(id => {
      if (taskIndex[id]) flatTasks.push(taskIndex[id]);
    });
  }


  /* ================================================================
     HANDLERS FOR CHECKBOXES
     ================================================================ */

  const toggleSummary = (id) => {
    setSelectedTasks([]); // manual tasks reset
    setSelectedSummaries(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleBundle = (id) => {
    setSelectedTasks([]); // manual tasks reset
    setSelectedBundles(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleTask = (id) => {
    setSelectedSummaries([]); // selecting tasks resets summary selection
    setSelectedBundles([]);
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };


  /* ================================================================
     ADD TO WORKSPACE
     ================================================================ */
  const handleAdd = () => {
    const summaryList = [...selectedSummaries];
    const taskList = [];

    // Gather tasks from summaries
    selectedSummaries.forEach(sumID => {
      const tasks = summaryTaskMap[sumID] || [];
      tasks.forEach(t => taskList.push(t.id));
    });

    // Gather tasks from bundles
    selectedBundles.forEach(bid => {
      const tasks = bundleTaskMap[bid] || [];
      tasks.forEach(t => taskList.push(t.id));
    });

    // Manual tasks
    selectedTasks.forEach(id => taskList.push(id));

    // Remove duplicates
    const uniqueTasks = Array.from(new Set(taskList));

    onSelectItem?.({
      summaries: summaryList,
      tasks: uniqueTasks
    });

    onClose();
  };


  /* ================================================================
     RENDER: HEADER + 3 COLUMNS + FOOTER BUTTON
     ================================================================ */
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
            className="repo-search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="repo-select"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option>All</option>
            <option>Generic</option>
          </select>

          <select
            className="repo-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Software</option>
          </select>
        </div>

        {/* BODY: 3 COLUMNS */}
        <div className="repo-body">

          {/* COLUMN 1 -------------------------------------------------- */}
          <div className="repo-col1">
            {/* SUMMARIES */}
            <div className="repo-section">
              <div
                className="repo-section-header"
                onClick={() => setShowSummaries(!showSummaries)}
              >
                <strong>Summaries</strong>
                <span>{showSummaries ? "▼" : "▶"}</span>
              </div>
              {showSummaries && (
                <div className="repo-section-body">
                  {summaries.map(sum => (
                    <label key={sum.id} className="repo-item">
                      <input
                        type="checkbox"
                        checked={selectedSummaries.includes(sum.id)}
                        onChange={() => toggleSummary(sum.id)}
                      />
                      {sum.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* BUNDLES */}
            <div className="repo-section">
              <div
                className="repo-section-header"
                onClick={() => setShowBundles(!showBundles)}
              >
                <strong>Bundles</strong>
                <span>{showBundles ? "▼" : "▶"}</span>
              </div>
              {showBundles && (
                <div className="repo-section-body">
                  {bundles.map(b => (
                    <label key={b.id} className="repo-item">
                      <input
                        type="checkbox"
                        checked={selectedBundles.includes(b.id)}
                        onChange={() => toggleBundle(b.id)}
                      />
                      {b.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2 -------------------------------------------------- */}
          <div className="repo-col2">
            {selectedSummaries.length > 0 ? (
              /* GROUPED VIEW */
              Object.entries(groupedTasks).map(([sumID, tasks]) => {
                const summaryName = summaries.find(s => s.id === sumID)?.name || "Summary";
                return (
                  <div key={sumID} className="repo-group">
                    <h4 className="repo-group-title">{summaryName}</h4>
                    {tasks.length === 0 && (
                      <p className="repo-empty">No tasks in this summary.</p>
                    )}
                    {tasks.map(t => (
                      <label key={t.id} className="repo-item">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(t.id)}
                          onChange={() => toggleTask(t.id)}
                        />
                        {t.name}
                      </label>
                    ))}
                  </div>
                );
              })
            ) : (
              /* FLAT VIEW */
              <>
                {flatTasks.length === 0 && (
                  <p className="repo-empty">No tasks available.</p>
                )}
                {flatTasks.map(t => (
                  <label key={t.id} className="repo-item">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(t.id)}
                      onChange={() => toggleTask(t.id)}
                    />
                    {t.name}
                  </label>
                ))}
              </>
            )}
          </div>

          {/* COLUMN 3 -------------------------------------------------- */}
          <div className="repo-col3">
            <button className="repo-add-btn" onClick={handleAdd}>
              Add to Workspace
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
