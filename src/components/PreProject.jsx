import { useState } from "react";
import AddItemPopup from "./AddItemPopup";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 17 — Popup Wiring with Permission Enforcement (Read-Only)
---------------------------------------------------------------------
• TaskPopup wired from PreProject
• Stage 17.2 rules enforced from first render
• Identity sourced temporarily from localStorage.currentUser
• Fail-closed permission model
=====================================================================
*/

export default function PreProject({
  initialTasks = [],
  initialSummaries = []
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [summaries, setSummaries] = useState(initialSummaries);
  const [popupMode, setPopupMode] = useState(null);

  // Task popup state
  const [activeTask, setActiveTask] = useState(null);

  // Inline delete confirmation state
  const [pendingDeleteSummaryId, setPendingDeleteSummaryId] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  /* -------------------------------------------------
     Identity (TEMPORARY — Stage 17)
     ------------------------------------------------- */
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  })();

  const currentUserId = currentUser?.id ?? null;

  /* -------------------------------------------------
     Permission helpers (Stage 17.2)
     ------------------------------------------------- */
  const getPmAuthorityId = (task) => {
    // Explicit PM wins; otherwise creator defaults to PM
    return task.pmId || task.creatorId || null;
  };

  const isAssigned = (task) =>
    Boolean(
      (typeof task.assigned === "string" && task.assigned.trim()) ||
      (typeof task.person === "string" && task.person.trim())
    );

  const canOpenTaskPopup = (task) => {
    if (!currentUserId || !task) return false;

    const pmAuthorityId = getPmAuthorityId(task);
    if (pmAuthorityId && pmAuthorityId === currentUserId) return true;

    if (!isAssigned(task)) return false;

    // Assigned person (by id match if present, else name match as fallback)
    if (task.assignedId && task.assignedId === currentUserId) return true;
    if (task.assigned && task.assigned === currentUserId) return true;
    if (task.person && task.person === currentUserId) return true;

    // Admin delegate logic comes later (Stage 17.3+)
    return false;
  };

  /* -------------------------------------------------
     Add Summary (unchanged)
     ------------------------------------------------- */
  function handleAddSummary({ title }) {
    const newSummary = {
      id: crypto.randomUUID(),
      title
    };

    setSummaries(prev => [...prev, newSummary]);
    setPopupMode(null);
  }

  /* -------------------------------------------------
     Stage 13.0-C — Confirmed Summary Deletion (unchanged)
     ------------------------------------------------- */
  function requestDeleteSummary(summaryId) {
    setPendingDeleteSummaryId(summaryId);
  }

  function cancelDeleteSummary() {
    setPendingDeleteSummaryId(null);
  }

  function confirmDeleteSummary(summaryId) {
    setSummaries(prev =>
      prev.filter(summary => summary.id !== summaryId)
    );

    setTasks(prev =>
      prev.map(task =>
        task.summaryId === summaryId
          ? { ...task, summaryId: null }
          : task
      )
    );

    setPendingDeleteSummaryId(null);
    setToast("Summary removed from workspace — tasks unaffected");
    setTimeout(() => setToast(null), 3000);
  }

  /* -------------------------------------------------
     Task click → attempt popup open (Stage 17.2)
     ------------------------------------------------- */
  const handleTaskClick = (task) => {
    if (!canOpenTaskPopup(task)) return; // fail closed
    setActiveTask(task);
  };

  /* -------------------------------------------------
     Render helpers
     ------------------------------------------------- */
  const tasksForSummary = id =>
    tasks.filter(task => task.summaryId === id);

  const orphanTasks = tasks.filter(task => task.summaryId == null);

  /* -------------------------------------------------
     Render
     ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      {/* Footer actions (temporary host) */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPopupMode("add-summary")}>
          Add Summary
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            marginBottom: "0.5rem",
            padding: "0.5rem",
            background: "#f0f0f0"
          }}
        >
          {toast}
        </div>
      )}

      {/* Orphan tasks — clickable */}
      {orphanTasks.map(task => (
        <div
          key={task.id}
          style={{ cursor: "pointer" }}
          onClick={() => handleTaskClick(task)}
        >
          {task.title}
        </div>
      ))}

      {/* Summaries */}
      {summaries.map(summary => (
        <section key={summary.id}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {summary.title}

            {pendingDeleteSummaryId === summary.id ? (
              <>
                <button
                  onClick={() => confirmDeleteSummary(summary.id)}
                >
                  Confirm
                </button>
                <button onClick={cancelDeleteSummary}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => requestDeleteSummary(summary.id)}
                title="Remove summary"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ×
              </button>
            )}
          </h3>

          {tasksForSummary(summary.id).map(task => (
            <div
              key={task.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleTaskClick(task)}
            >
              {task.title}
            </div>
          ))}
        </section>
      ))}

      {/* Add Summary popup */}
      {popupMode === "add-summary" && (
        <AddItemPopup
          mode="add-summary"
          onConfirm={handleAddSummary}
          onCancel={() => setPopupMode(null)}
        />
      )}

      {/* Task Popup (permission-gated before render) */}
      {activeTask && (
        <TaskPopup
          task={activeTask}
          pane="preproject"
          onClose={() => setActiveTask(null)}
          onUpdate={(update) => {
            setTasks(prev =>
              prev.map(t =>
                t.id === activeTask.id ? { ...t, ...update } : t
              )
            );
          }}
        />
      )}
    </div>
  );
}
