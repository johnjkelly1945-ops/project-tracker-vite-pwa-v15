/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 350A — Repository UI Stabilisation (Zoning Correction)
   ====================================================================== */

import React, { useState, useMemo } from "react";
import "../Styles/RepositoryView.css";
import { corporateTemplates } from "../data/corporateTemplates";

export default function RepositoryView({
  discipline,
  onDownloadTask,
  onDownloadSummary,
  onClose
}) {

  /* ================================================================
     DISCIPLINE FILTER (BASELINE PRESERVED)
     ================================================================ */

  const disciplineFiltered = useMemo(() => {
    return corporateTemplates.filter(e =>
      e.status === "active" &&
      (e.discipline === discipline || e.discipline === "both")
    );
  }, [discipline]);

  /* ================================================================
     STAGE 350 — FILTER STATE MODEL (UNCHANGED)
     ================================================================ */

  const [selectedType, setSelectedType] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedScope, setSelectedScope] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const isFilterComplete =
    selectedType &&
    selectedMethod &&
    selectedScope &&
    selectedLevel;

  /* ================================================================
     DIMENSION FILTER APPLICATION (UNCHANGED)
     ================================================================ */

  const filteredEntities = isFilterComplete
    ? disciplineFiltered.filter(e =>
        e.type === selectedType &&
        e.method === selectedMethod &&
        e.scope === selectedScope &&
        e.level === selectedLevel
      )
    : [];

  const bundles = filteredEntities.filter(e => e.entityType === "bundle");
  const summaries = filteredEntities.filter(e => e.entityType === "summary");
  const tasks = filteredEntities.filter(e => e.entityType === "task");

  /* ================================================================
     SELECTION STATE (UNCHANGED)
     ================================================================ */

  const [selectedBundles, setSelectedBundles] = useState({});
  const [selectedSummaries, setSelectedSummaries] = useState({});
  const [selectedTasks, setSelectedTasks] = useState({});

  /* ================================================================
     DERIVED — Visible Summaries (UNCHANGED)
     ================================================================ */

  const visibleSummaries = useMemo(() => {

    const activeBundleIds = Object.keys(selectedBundles)
      .filter(id => selectedBundles[id]);

    if (activeBundleIds.length === 0) return [];

    const collected = new Set();

    activeBundleIds.forEach(bid => {
      const bundle = bundles.find(b => b.id === bid);
      bundle?.contains?.forEach(sid => collected.add(sid));
    });

    return summaries.filter(s => collected.has(s.id));

  }, [selectedBundles, bundles, summaries]);

  /* ================================================================
     DERIVED — Visible Tasks (UNCHANGED)
     ================================================================ */

  const visibleTasks = useMemo(() => {

    const activeSummaryIds = Object.keys(selectedSummaries)
      .filter(id => selectedSummaries[id]);

    if (activeSummaryIds.length === 0) return [];

    return tasks.filter(t =>
      t.linkedSummaryIds?.some(id => activeSummaryIds.includes(id))
    );

  }, [selectedSummaries, tasks]);

  /* ================================================================
     RENDER — ZONING CORRECTION ONLY
     ================================================================ */

  return (
    <div className="repo-overlay">

      {/* ============================================================
         TOP BAR — Discipline Context Integrated
         ============================================================ */}

      <div className="repo-topbar">
        <h2>
          Repository
          {discipline && (
            <span className="repo-discipline-context">
              {" — "}{discipline}
            </span>
          )}
        </h2>
        <button
          className="repo-close-btn"
          onClick={() => onClose?.()}
        >
          ✕
        </button>
      </div>

      {/* ============================================================
         FILTER HEADER (Filters Only)
         ============================================================ */}

      <div className="repo-filter-header">
        <div className="repo-filters">
          <p className="repo-placeholder">
            {isFilterComplete
              ? "Filters Complete"
              : "Select Type, Method, Scope, Level"}
          </p>
        </div>
      </div>

      {/* ============================================================
         TWO COLUMN STRUCTURE
         ============================================================ */}

      <div className="repo-columns">

        {/* LEFT COLUMN — Bundles + Summaries */}

        <div className="repo-column-left">

          <h3>Bundles</h3>
          {bundles.map(b => (
            <label key={b.id} className="repo-task-row">
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
              {b.title}
            </label>
          ))}

          <h3>Summaries</h3>
          {visibleSummaries.map(s => (
            <label key={s.id} className="repo-task-row">
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
              {s.title}
            </label>
          ))}

        </div>

        {/* RIGHT COLUMN — Tasks */}

        <div className="repo-column-right">

          <h3>Tasks</h3>

          {visibleTasks.map(t => (
            <label key={t.id} className="repo-task-row">
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
              {t.title}
            </label>
          ))}

        </div>

      </div>

      {/* ============================================================
         BOTTOM BAR
         ============================================================ */}

      <div className="repo-bottombar">

        <button
          className="repo-return-btn"
          onClick={() => onClose?.()}
        >
          Return to Project
        </button>

        <button
          className="repo-download-btn"
          onClick={() => {

            Object.keys(selectedSummaries)
              .filter(id => selectedSummaries[id])
              .forEach(id => {
                const s = summaries.find(x => x.id === id);
                onDownloadSummary?.(s);
              });

            Object.keys(selectedTasks)
              .filter(id => selectedTasks[id])
              .forEach(id => {
                const t = tasks.find(x => x.id === id);
                onDownloadTask?.(t);
              });

            onClose?.();
          }}
        >
          Add Selected to Project
        </button>

      </div>

    </div>
  );
}
