// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 26 — Phase 1
Summary Linkage (Data Shape & Authority Only)
=====================================================================

AUTHORITATIVE RULES:
• PreProject.jsx is the sole authority for task existence.
• PreProject.jsx is the sole authority for task ↔ summary linkage.
• UI components may request linkage but never mutate state.
• No UI affordances, inference, or auto-linking in this phase.

PRESERVES:
• Stage 25 — Canonical task creation, persistence, rehydration
• Stage 24 — Task click → popup behaviour (unchanged)

=====================================================================
*/

/* ---------------------------------------------------------------
   PERSISTENCE CONTRACT (SINGLE KEY)
   --------------------------------------------------------------- */
const STORAGE_KEY = "metra.workspace.tasks";

export default function PreProject() {
  /* ---------------------------------------------------------------
     AUTHORITATIVE WORKSPACE STATE
     --------------------------------------------------------------- */
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [rehydrationError, setRehydrationError] = useState(null);

  // Stage 26 — Phase 1: visible linkage failure (workspace-owned)
  const [linkageError, setLinkageError] = useState(null);

  /* ---------------------------------------------------------------
     PHASE 4B — REHYDRATION (READ ONCE, ON LOAD)
     --------------------------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    // No stored data → valid empty workspace
    if (!stored) return;

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch {
      setRehydrationError("Stored task data is not valid JSON.");
      return;
    }

    // Must be an array
    if (!Array.isArray(parsed)) {
      setRehydrationError("Stored task data is not an array.");
      return;
    }

    // Validate every task strictly
    for (const task of parsed) {
      const valid =
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.status === "string" &&
        typeof task.createdAt === "number" &&
        "summaryId" in task;

      if (!valid) {
        setRehydrationError(
          "Stored task data is invalid. Workspace cannot be loaded."
        );
        return;
      }
    }

    // All tasks valid → populate authoritative state
    setTasks(parsed);
  }, []);

  /* ---------------------------------------------------------------
     STAGE 26 — PHASE 1 VALIDATION HELPERS
     --------------------------------------------------------------- */
  function requireTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      setLinkageError(`Linkage error: task '${taskId}' does not exist.`);
      return null;
    }
    return task;
  }

  function requireSummaryId(summaryId) {
    if (typeof summaryId !== "string" || !summaryId.trim()) {
      setLinkageError("Linkage error: summaryId must be a non-empty string.");
      return null;
    }
    return summaryId.trim();
  }

  /* ---------------------------------------------------------------
     STAGE 26 — PHASE 1 LINKAGE MUTATION HELPERS
     --------------------------------------------------------------- */
  function linkTaskToSummary(taskId, summaryId) {
    setLinkageError(null);

    const task = requireTask(taskId);
    const validSummaryId = requireSummaryId(summaryId);
    if (!task || !validSummaryId) return;

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, summaryId: validSummaryId } : t
    );

    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  function unlinkTaskFromSummary(taskId) {
    setLinkageError(null);

    const task = requireTask(taskId);
    if (!task) return;

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, summaryId: null } : t
    );

    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  function moveTaskToSummary(taskId, summaryId) {
    linkTaskToSummary(taskId, summaryId);
  }

  /* ---------------------------------------------------------------
     STAGE 25 — CANONICAL TASK CREATION (UNCHANGED)
     --------------------------------------------------------------- */
  function createTask(title) {
    if (typeof title !== "string") return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      status: "open",
      createdAt: Date.now(),
      summaryId: null,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  }

  /* ---------------------------------------------------------------
     TEMPORARY WORKSPACE-LEVEL CREATION CONTROL
     --------------------------------------------------------------- */
  function handleCreateTaskClick() {
    const title = prompt("Enter task title");
    createTask(title);
  }

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  if (rehydrationError) {
    return (
      <div style={{ padding: "16px", color: "red" }}>
        <strong>Workspace Error</strong>
        <div>{rehydrationError}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      {linkageError && (
        <div style={{ marginBottom: "12px", color: "red" }}>
          <strong>{linkageError}</strong>
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <button onClick={handleCreateTaskClick}>
          Create Task (Stage 25 – Temporary)
        </button>
      </div>

      <div>
        {tasks.length === 0 && (
          <div style={{ opacity: 0.6 }}>No tasks in workspace</div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setActiveTask(task)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              marginBottom: "6px",
              cursor: "pointer",
            }}
          >
            {task.title}
          </div>
        ))}
      </div>

      {activeTask && (
        <TaskPopup
          task={activeTask}
          pane="workspace"
          onClose={() => setActiveTask(null)}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
}
