// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";

/*
=====================================================================
METRA — PreProject.jsx
Stage 28A — Step 1
Summary Instantiation (Minimal, Non-Authoritative)
=====================================================================

AUTHORITATIVE RULES:
• PreProject.jsx remains the sole authority for tasks.
• Summaries are non-authoritative entities.
• Summaries do not own tasks.
• No linkage, grouping, or movement logic is introduced here.
• New summaries are appended as the last rendered item in the workspace.

PRESERVES:
• Stage 24 — Task click → popup behaviour
• Stage 25 — Canonical task creation & persistence
• Stage 26 — Summary linkage authority (unchanged)
=====================================================================
*/

const TASK_STORAGE_KEY = "metra.workspace.tasks";
const SUMMARY_STORAGE_KEY = "metra.workspace.summaries";

export default function PreProject() {
  /* ---------------------------------------------------------------
     AUTHORITATIVE WORKSPACE STATE
     --------------------------------------------------------------- */
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [rehydrationError, setRehydrationError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  /* ---------------------------------------------------------------
     REHYDRATION — TASKS & SUMMARIES (READ ONCE)
     --------------------------------------------------------------- */
  useEffect(() => {
    // --- Tasks ---
    const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      } catch {
        setRehydrationError("Stored task data is invalid.");
        return;
      }
    }

    // --- Summaries ---
    const storedSummaries = localStorage.getItem(SUMMARY_STORAGE_KEY);
    if (storedSummaries) {
      try {
        const parsed = JSON.parse(storedSummaries);
        if (Array.isArray(parsed)) {
          setSummaries(parsed);
        }
      } catch {
        setRehydrationError("Stored summary data is invalid.");
        return;
      }
    }
  }, []);

  /* ---------------------------------------------------------------
     STAGE 28A — SUMMARY CREATION (MINIMAL)
     --------------------------------------------------------------- */
  function createSummary(title) {
    setSummaryError(null);

    if (typeof title !== "string") return;
    const trimmed = title.trim();
    if (!trimmed) {
      setSummaryError("Summary name is required.");
      return;
    }

    const newSummary = {
      id: crypto.randomUUID(),
      title: trimmed,
      createdAt: Date.now(),
    };

    const updated = [...summaries, newSummary];
    setSummaries(updated);
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(updated));
  }

  /* ---------------------------------------------------------------
     STAGE 25 — CANONICAL TASK CREATION (UNCHANGED)
     --------------------------------------------------------------- */
  function createTask(title) {
    if (typeof title !== "string") return;
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmed,
      status: "open",
      createdAt: Date.now(),
      summaryId: null,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updated));
  }

  /* ---------------------------------------------------------------
     FOOTER ACTIONS (TEMPORARY, EXPLICIT)
     --------------------------------------------------------------- */
  function handleCreateTaskClick() {
    const title = prompt("Enter task title");
    createTask(title);
  }

  function handleCreateSummaryClick() {
    const title = prompt("Enter summary name");
    createSummary(title);
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
      {summaryError && (
        <div style={{ marginBottom: "12px", color: "red" }}>
          <strong>{summaryError}</strong>
        </div>
      )}

      {/* FOOTER CONTROLS */}
      <div style={{ marginBottom: "16px" }}>
        <button onClick={handleCreateTaskClick}>
          Create Task
        </button>{" "}
        <button onClick={handleCreateSummaryClick}>
          Create Summary
        </button>
      </div>

      {/* WORKSPACE LIST (UNIFIED, ORDER-ONLY) */}
      <div>
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
            🗂️ {task.title}
          </div>
        ))}

        {summaries.map((summary) => (
          <div
            key={summary.id}
            style={{
              padding: "8px",
              border: "1px dashed #999",
              marginBottom: "6px",
              opacity: 0.85,
            }}
          >
            📌 {summary.title}
          </div>
        ))}

        {tasks.length === 0 && summaries.length === 0 && (
          <div style={{ opacity: 0.6 }}>
            Workspace is empty
          </div>
        )}
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
