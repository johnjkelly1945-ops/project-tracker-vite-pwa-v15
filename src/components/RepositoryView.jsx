/* ======================================================================
   METRA – RepositoryView.jsx
   Stage 354 – APPLY Commit Model (Bundles → Summaries Reveal)
   Stage 354A — Summary Checkbox Selection (UI ONLY)
   ----------------------------------------------------------------------
   RESPONSIBILITIES (Stage 354/354A):
   • Repository opens empty (no results until APPLY).
   • Filters + Search configure query.
   • APPLY commits query (no live filtering).
   • After APPLY: show Bundles only in Column 1.
   • Clicking a Bundle reveals its Summaries beneath (same column).
   • Summaries have checkbox select/deselect (multi-select).
   • Tasks are NOT shown in this step (reserved for next stage).
   • Templates column header only (empty).
   • Close/Return emits CLOSE_REPOSITORY_INTENT only.
   ----------------------------------------------------------------------
   NON-GOALS:
   • No task reveal wiring
   • No task checkbox wiring
   • No download semantics beyond existing scaffolding
   • No persistence of filter/search state
   • No repository data model mutation
   ====================================================================== */

import React, { useEffect, useMemo, useState } from "react";
import "../Styles/RepositoryView.css";

/* ----------------------------------------------------------------------
   Placeholder repository data (Stage 354 scaffolding only)
   ---------------------------------------------------------------------- */

const PLACEHOLDER_REPO_BUNDLES = [
  {
    id: "repo-bundle-001",
    title: "Project Initiation (Generic)",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-bundle-002",
    title: "Delivery Controls (Generic)",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
];

const PLACEHOLDER_REPO_SUMMARIES = [
  {
    id: "repo-summary-001",
    title: "Initiation Summary",
    discipline: "management",
    bundleId: "repo-bundle-001",
  },
  {
    id: "repo-summary-002",
    title: "Delivery Summary",
    discipline: "management",
    bundleId: "repo-bundle-002",
  },
];

const PLACEHOLDER_REPO_TASKS = [
  {
    id: "repo-task-001",
    title: "Prepare project initiation notes",
    description: "Draft initial scope, assumptions, and constraints.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-task-002",
    title: "Identify key stakeholders",
    description: "List internal and external stakeholders.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
  {
    id: "repo-task-003",
    title: "Define success criteria",
    description: "Document measurable success factors.",
    discipline: "management",
    type: "Generic",
    scope: "Generic",
    level: "Project",
    method: "Generic",
  },
];

/* ----------------------------------------------------------------------
   Intent emitter (intent-only)
   ---------------------------------------------------------------------- */
function emitIntent(type, payload = null) {
  const intent = {
    type,
    source: "RepositoryView",
    payload,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("METRA_INTENT", { detail: intent }));
}

/* ----------------------------------------------------------------------
   Small helper for dropdown options derived from data
   ---------------------------------------------------------------------- */
function uniqueValues(items, field) {
  const set = new Set();
  items.forEach((i) => {
    if (i && i[field]) set.add(i[field]);
  });
  return Array.from(set).sort();
}

export default function RepositoryView(props) {
  // Pane context (default mgmt). Upstream may later pass this explicitly.
  // Accepted values: "mgmt" | "dev"
  const pane = props?.pane === "dev" ? "dev" : "mgmt";

  const headerText =
    pane === "dev"
      ? "Repository — Development Items"
      : "Repository — Management Items";

  // Discipline scaffolding (kept simple for now)
  const activeDiscipline = pane === "dev" ? "development" : "management";

  /* ===================== QUERY INPUT (UNCOMMITTED) ===================== */

  const [selectedType, setSelectedType] = useState("");
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  // Method is second-order; disabled until some context exists (type/scope/level selected)
  const [selectedMethod, setSelectedMethod] = useState("NONE");

  // Global text search (applied only on APPLY)
  const [searchTerm, setSearchTerm] = useState("");

  /* ===================== APPLY COMMIT (COMMITTED QUERY) ===================== */

  const [resultsLoaded, setResultsLoaded] = useState(false);

  const [appliedType, setAppliedType] = useState("");
  const [appliedScope, setAppliedScope] = useState("");
  const [appliedLevel, setAppliedLevel] = useState("");
  const [appliedMethod, setAppliedMethod] = useState("NONE");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Bundle expansion (reveals summaries beneath bundle)
  const [expandedBundles, setExpandedBundles] = useState({});

  /* ===================== SELECTION (354A) ===================== */

  // Multi-select summaries (checkbox)
  const [selectedSummaryIds, setSelectedSummaryIds] = useState({});

  /* ===================== LEGACY SELECTION (PARKED) ===================== */

  // Kept for continuity; tasks are not surfaced in Stage 354/354A.
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  /* ===================== BASE DATASETS ===================== */

  const tasksBase = useMemo(() => {
    return PLACEHOLDER_REPO_TASKS.filter((t) => t.discipline === activeDiscipline);
  }, [activeDiscipline]);

  const bundlesBase = useMemo(() => {
    return PLACEHOLDER_REPO_BUNDLES.filter((b) => b.discipline === activeDiscipline);
  }, [activeDiscipline]);

  const summariesBase = useMemo(() => {
    return PLACEHOLDER_REPO_SUMMARIES.filter((s) => s.discipline === activeDiscipline);
  }, [activeDiscipline]);

  /* ===================== DROPDOWN OPTIONS ===================== */

  const typeOptions = useMemo(() => uniqueValues(tasksBase, "type"), [tasksBase]);
  const scopeOptions = useMemo(() => uniqueValues(tasksBase, "scope"), [tasksBase]);
  const levelOptions = useMemo(() => uniqueValues(tasksBase, "level"), [tasksBase]);
  const methodOptions = useMemo(() => uniqueValues(tasksBase, "method"), [tasksBase]);

  const isMethodEnabled = Boolean(selectedType || selectedScope || selectedLevel);

  useEffect(() => {
    if (!isMethodEnabled && selectedMethod !== "NONE") {
      setSelectedMethod("NONE");
    }
  }, [isMethodEnabled, selectedMethod]);

  /* ===================== HANDLERS ===================== */

  const handleClose = () => emitIntent("CLOSE_REPOSITORY_INTENT");

  const clearAll = () => {
    // Clear inputs only (committed results remain until next APPLY or close)
    setSearchTerm("");
    setSelectedType("");
    setSelectedScope("");
    setSelectedLevel("");
    setSelectedMethod("NONE");
    setSelectedTaskId(null);
  };

  const handleApply = () => {
    setAppliedType(selectedType);
    setAppliedScope(selectedScope);
    setAppliedLevel(selectedLevel);
    setAppliedMethod(isMethodEnabled ? selectedMethod : "NONE");
    setAppliedSearch(searchTerm.trim());

    // Reset reveal + selections each time APPLY is committed
    setExpandedBundles({});
    setSelectedSummaryIds({});
    setSelectedTaskId(null);

    setResultsLoaded(true);
  };

  const toggleBundle = (bundleId) => {
    setExpandedBundles((c) => ({ ...c, [bundleId]: !c[bundleId] }));
  };

  const toggleSummary = (summaryId) => {
    setSelectedSummaryIds((c) => {
      const next = { ...c };
      if (next[summaryId]) delete next[summaryId];
      else next[summaryId] = true;
      return next;
    });
  };

  /* ===================== FILTERED RESULTS (POST-APPLY) ===================== */

  const visibleBundles = useMemo(() => {
    if (!resultsLoaded) return [];

    const q = (appliedSearch || "").trim().toLowerCase();

    return bundlesBase.filter((b) => {
      if (appliedType && b.type !== appliedType) return false;
      if (appliedScope && b.scope !== appliedScope) return false;
      if (appliedLevel && b.level !== appliedLevel) return false;
      if (appliedMethod !== "NONE" && b.method !== appliedMethod) return false;

      if (q) {
        const hay = `${b.title}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [
    resultsLoaded,
    bundlesBase,
    appliedType,
    appliedScope,
    appliedLevel,
    appliedMethod,
    appliedSearch,
  ]);

  const summariesByBundle = useMemo(() => {
    if (!resultsLoaded) return {};

    const map = {};
    summariesBase.forEach((s) => {
      if (!map[s.bundleId]) map[s.bundleId] = [];
      map[s.bundleId].push(s);
    });

    // If search is present, also apply it to summaries
    const q = (appliedSearch || "").trim().toLowerCase();
    if (q) {
      Object.keys(map).forEach((bundleId) => {
        map[bundleId] = map[bundleId].filter((s) =>
          `${s.title}`.toLowerCase().includes(q)
        );
      });
    }

    return map;
  }, [resultsLoaded, summariesBase, appliedSearch]);

  const selectedSummaryCount = useMemo(() => {
    return Object.keys(selectedSummaryIds).length;
  }, [selectedSummaryIds]);

  return (
    <div className="repo-overlay" role="dialog" aria-modal="true">
      <div className="repo-modal">
        {/* ===== Top Bar ===== */}
        <div className="repo-topbar">
          <h2>{headerText}</h2>

          <button className="repo-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* ===== Filter Bar ===== */}
        <div className="repo-filterbar">
          <div className="repo-filtergroup">
            <label>Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">(none)</option>
              {typeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="repo-filtergroup">
            <label>Scope</label>
            <select value={selectedScope} onChange={(e) => setSelectedScope(e.target.value)}>
              <option value="">(none)</option>
              {scopeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="repo-filtergroup">
            <label>Level</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="">(none)</option>
              {levelOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="repo-filtergroup">
            <label>Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              disabled={!isMethodEnabled}
              className={!isMethodEnabled ? "repo-select-disabled" : ""}
            >
              <option value="NONE">NONE</option>
              {methodOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="repo-filtergroup repo-search">
            <label>Search</label>
            <input
              className="repo-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search repository..."
            />
          </div>

          <div className="repo-filtergroup repo-apply">
            <label>&nbsp;</label>
            <button className="repo-apply-btn" onClick={handleApply}>
              APPLY
            </button>
          </div>

          <div className="repo-filtergroup repo-clear">
            <label>&nbsp;</label>
            <button className="repo-clear-btn" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        {/* ===== Main Layout ===== */}
        <div className="repo-content-grid">
          {/* Column 1: Bundles + Summaries */}
          <div className="repo-panel">
            <h3>Bundles</h3>

            {!resultsLoaded ? (
              <div className="repo-empty">Set filters and press APPLY.</div>
            ) : visibleBundles.length === 0 ? (
              <div className="repo-empty">No bundles available.</div>
            ) : (
              visibleBundles.map((b) => {
                const isOpen = Boolean(expandedBundles[b.id]);
                const summaries = summariesByBundle[b.id] || [];

                return (
                  <div key={b.id} className="repo-bundle-block">
                    <div
                      className="repo-bundle-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleBundle(b.id)}
                    >
                      <span className="repo-bundle-title">{b.title}</span>
                      <span className="repo-bundle-caret">{isOpen ? "▾" : "▸"}</span>
                    </div>

                    {isOpen &&
                      (summaries.length === 0 ? (
                        <div className="repo-empty repo-indent">No summaries.</div>
                      ) : (
                        summaries.map((s) => {
                          const checked = Boolean(selectedSummaryIds[s.id]);

                          return (
                            <div
                              key={s.id}
                              className="repo-summary-row repo-indent"
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSummary(s.id);
                              }}
                            >
                              <input
                                type="checkbox"
                                className="repo-tick"
                                checked={checked}
                                onChange={() => toggleSummary(s.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span>{s.title}</span>
                            </div>
                          );
                        })
                      ))}
                  </div>
                );
              })
            )}
          </div>

          {/* Column 2: Tasks */}
          <div className="repo-panel">
            <h3>Tasks</h3>
            <div className="repo-empty">Tasks are not surfaced in this stage.</div>
          </div>

          {/* Column 3: Templates */}
          <div className="repo-panel">
            <h3>Templates</h3>
            <div className="repo-empty">&nbsp;</div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="repo-bottombar">
          <button className="repo-return-btn" onClick={handleClose}>
            Return to Project
          </button>

          <button className="repo-download-btn" disabled={true}>
            Add Selected to Project{selectedSummaryCount > 0 ? ` (${selectedSummaryCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
