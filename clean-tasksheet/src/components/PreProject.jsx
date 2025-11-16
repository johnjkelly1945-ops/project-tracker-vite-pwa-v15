/* ======================================================================
   METRA – PreProject.jsx (v3 FIXED)
   Flat Task List · Inline Edit · Delete Summary
   Sticky Header · Scrollable Tasks · Unified Storage (tasks_v3)
   FIX: Status now persists correctly after assignment
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

/* ================================================================
   DEFAULT ITEMS (Summaries + Tasks)
   ================================================================ */
const defaultItems = [
  { id: "S1", type: "summary", title: "Project Management Summary", expanded: false },
  { id: "S2", type: "summary", title: "Governance Summary", expanded: false },

  { id: "T1", type: "task", title: "Prepare Scope Summary", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T2", type: "task", title: "Initial Risk Scan", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T3", type: "task", title: "Stakeholder Mapping", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T4", type: "task", title: "Identify Dependencies", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T5", type: "task", title: "Review Governance Requirements", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T6", type: "task", title: "Draft Initiation Brief", status: "Not Started", assigned: null, notes: [], flag: null },
  { id: "T7", type: "task", title: "Validate Stakeholder List", status: "Not Started", assigned: null, notes: [], flag: null }
];

/* ================================================================
   NORMALISER (FIXED STATUS LOGIC)
   ================================================================ */
const normalise = (item) => ({
  id: String(item.id),
  type: item.type || "task",
  title: item.title || "Untitled",
  expanded: item.type === "summary" ? !!item.expanded : false,
  status: item.type === "task"
    ? (item.status != null ? item.status : "Not Started")   // FIXED
    : undefined,
  assigned: item.type === "task" ? item.assigned || null : undefined,
  notes: item.type === "task"
    ? (Array.isArray(item.notes) ? item.notes : [])
    : undefined,
  flag: item.type === "task" ? item.flag || null : undefined
});

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function PreProject({ setScreen, injectedTasks, clearInjectedTasks }) {

  /* LOAD FROM STORAGE */
  const loadInitial = () => {
    const saved = localStorage.getItem("tasks_v3");
    if (!saved) return defaultItems.map(normalise);

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.map(normalise);
      return defaultItems.map(normalise);
    } catch {
      return defaultItems.map(normalise);
    }
  };

  const [items, setItems] = useState(loadInitial);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(items));
  }, [items]);

  /* ================================================================
     MERGE INJECTED TASKS
     ================================================================ */
  useEffect(() => {
    if (!injectedTasks || injectedTasks.length === 0) return;

    const incoming = injectedTasks.map(normalise);

    setItems(prev => {
      const titles = new Set(prev.map(x => x.title));
      const merged = [...prev];

      incoming.forEach(i => {
        if (!titles.has(i.title)) merged.push(i);
      });

      return merged;
    });

    clearInjectedTasks();
  }, [injectedTasks, clearInjectedTasks]);

  /* ================================================================
     UI STATE
     ================================================================ */
  const [activeId, setActiveId] = useState(null);
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const activeItem = items.find(i => i.id === activeId);

  /* ================================================================
     INLINE EDIT
     ================================================================ */
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditingValue(title);
  };

  const applyEdit = () => {
    setItems(prev =>
      prev.map(i =>
        i.id === editingId ? { ...i, title: editingValue } : i
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  /* ================================================================
     TASK OPERATIONS
     ================================================================ */
  const openTaskPopup = (id) => {
    setActiveId(String(id));
    setShowWorkingWindow(true);
  };

  const startAssign = (id) => {
    setActiveId(String(id));
    setShowAssignOverlay(true);
  };

  const applyAssign = (personObj) => {
    setItems(prev =>
      prev.map(i =>
        i.id === activeId
          ? normalise({ ...i, assigned: personObj.name, status: "In Progress" })  // FIXED: preserved
          : i
      )
    );
    setShowAssignOverlay(false);
  };

  const saveNotes = (id, entry) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id
          ? normalise({ ...i, notes: [...i.notes, entry] })
          : i
      )
    );
  };

  const markCompleted = (id) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? normalise({ ...i, status: "Completed" }) : i
      )
    );
  };

  const archiveTask = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  /* ================================================================
     SUMMARY OPERATIONS
     ================================================================ */
  const toggleSummary = (id) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, expanded: !i.expanded } : i
      )
    );
  };

  const deleteSummary = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  /* ================================================================
     FILTERS
     ================================================================ */
  const summaries = items.filter(i => i.type === "summary");
  const tasks = items.filter(i => i.type === "task");

  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Flagged") return t.flag === "orange" || t.flag === "red";
    return t.status === filter;
  });

  /* ================================================================
     ADD SUMMARY / TASK
     ================================================================ */
  const addSummary = () => {
    const newId = "S-" + Date.now();
    setItems(prev => [
      ...prev,
      { id: newId, type: "summary", title: "New Summary", expanded: false }
    ]);
  };

  const addTask = () => {
    const newId = "T-" + Date.now();
    setItems(prev => [
      ...prev,
      { id: newId, type: "task", title: "New Task", status: "Not Started", assigned: null, notes: [], flag: null }
    ]);
  };

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div className="preproject-wrapper">

      {/* HEADER */}
      <div className="preproject-header">
        <h1>PreProject – Task Sheet</h1>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        {["All", "Flagged", "Not Started", "In Progress", "Completed", "On Hold"].map(f => (
          <button
            key={f}
            className={filter === f ? "filter-active" : "filter-btn"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* SCROLL AREA */}
      <div className="preproject-scroll-area">

        {/* SUMMARIES */}
        {summaries.map(summary => (
          <div key={summary.id} className="summary-block">

            <div className="summary-row" onClick={() => toggleSummary(summary.id)}>
              <span className="summary-dot" />

              {/* INLINE OR NORMAL TITLE */}
              {editingId === summary.id ? (
                <input
                  className="inline-edit"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={applyEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className="task-title"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(summary.id, summary.title);
                  }}
                >
                  {summary.title}
                </span>
              )}

              <span className="summary-arrow">
                {summary.expanded ? "▼" : "►"}
              </span>

              <span
                className="delete-summary"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSummary(summary.id);
                }}
              >
                ✕
              </span>
            </div>

            {summary.expanded && (
              <div className="summary-expanded-placeholder" />
            )}
          </div>
        ))}

        {/* TASK LIST */}
        <div className="task-list">
          {filteredTasks.map(t => (
            <div key={t.id} className="task-item">

              <div className="task-left" onClick={() => openTaskPopup(t.id)}>
                <span className={`status-dot ${t.status.replace(/ /g, "-")}`} />

                {editingId === t.id ? (
                  <input
                    className="inline-edit"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={applyEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="task-title"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(t.id, t.title);
                    }}
                  >
                    {t.title}
                  </span>
                )}

                {t.assigned && (
                  <span style={{ marginLeft: 6, fontStyle: "italic", color: "#555" }}>
                    — {t.assigned}
                  </span>
                )}
              </div>

              <button
                className="assign-btn"
                onClick={() => startAssign(t.id)}
              >
                Assign Person
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM ACTION ROW */}
      <div className="bottom-action-row">
        <button onClick={addSummary}>+ Add Summary</button>
        <button onClick={addTask}>+ Add Task</button>
        <button onClick={() => setScreen("repository")}>+ Add From Repository</button>
      </div>

      {/* OVERLAYS */}
      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyAssign}
          onClose={() => setShowAssignOverlay(false)}
        />
      )}

      {showPersonnelDetail && activeItem && (
        <PersonnelDetail
          personName={activeItem.assigned}
          allTasks={items}
          onClose={() => setShowPersonnelDetail(false)}
        />
      )}

      {showWorkingWindow && activeItem && (
        <TaskWorkingWindow
          task={activeItem}
          onClose={() => setShowWorkingWindow(false)}
          onSaveNotes={saveNotes}
          onArchiveTask={archiveTask}
          onInvokeCC={() => {}}
          onInvokeQC={() => {}}
          onInvokeEscalate={() => {}}
          onOpenPersonnelDetail={() => setShowPersonnelDetail(true)}
          onMarkCompleted={markCompleted}
        />
      )}

    </div>
  );
}
