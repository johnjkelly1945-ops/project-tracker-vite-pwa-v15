// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 30A — Summary Ordering Controls (Explicit & Non-Spatial)
Render-only, reversible, non-persistent
=====================================================================
*/

const TASK_STORAGE_KEY = "metra.workspace.tasks";
const SUMMARY_STORAGE_KEY = "metra.workspace.summaries";

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [summaryOrder, setSummaryOrder] = useState(null); // render-only
  const [activeTask, setActiveTask] = useState(null);
  const [rehydrationError, setRehydrationError] = useState(null);

  // ------------------------------------------------------------------
  // Rehydration (unchanged)
  // ------------------------------------------------------------------
  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || "[]");
      const s = JSON.parse(localStorage.getItem(SUMMARY_STORAGE_KEY) || "[]");
      if (Array.isArray(t)) setTasks(t);
      if (Array.isArray(s)) setSummaries(s);
    } catch {
      setRehydrationError("Workspace data is invalid.");
    }
  }, []);

  // Initialise render-only summary order once summaries are available
  useEffect(() => {
    if (!summaryOrder && summaries.length > 0) {
      setSummaryOrder(summaries.map((s) => s.id));
    }
  }, [summaries, summaryOrder]);

  // ------------------------------------------------------------------
  // Task creation (unchanged)
  // ------------------------------------------------------------------
  function createTask({ title, summaryId }) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      status: "open",
      createdAt: Date.now(),
      summaryId: summaryId || null,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updated));
  }

  if (rehydrationError) {
    return (
      <div style={{ padding: "16px", color: "red" }}>
        <strong>Workspace Error</strong>
        <div>{rehydrationError}</div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Stage 30A — Render-only summary ordering
  // ------------------------------------------------------------------

  // Index tasks by summaryId (unchanged semantics)
  const tasksBySummary = {};
  tasks.forEach((task) => {
    if (task.summaryId) {
      if (!tasksBySummary[task.summaryId]) {
        tasksBySummary[task.summaryId] = [];
      }
      tasksBySummary[task.summaryId].push(task);
    }
  });

  // Sort linked tasks by creation time (unchanged)
  Object.values(tasksBySummary).forEach((group) =>
    group.sort((a, b) => a.createdAt - b.createdAt)
  );

  // Resolve ordered summaries (fail closed)
  const orderedSummaries =
    Array.isArray(summaryOrder) && summaryOrder.length === summaries.length
      ? summaryOrder
          .map((id) => summaries.find((s) => s.id === id))
          .filter(Boolean)
      : summaries;

  // Orphan tasks (unchanged)
  const orphanTasks = tasks
    .filter((t) => !t.summaryId)
    .sort((a, b) => a.createdAt - b.createdAt);

  // Move handlers — atomic, guarded, reversible
  function moveSummary(index, direction) {
    if (!Array.isArray(summaryOrder)) return;
    const target = index + direction;
    if (target < 0 || target >= summaryOrder.length) return;

    const next = [...summaryOrder];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setSummaryOrder(next);
  }

  // ------------------------------------------------------------------

  return (
    <div style={{ padding: "16px" }}>
      {/* WORKSPACE LIST — Stage 30A render-only ordering */}
      <div>
        {orderedSummaries.map((summary, index) => (
          <div key={summary.id} style={{ marginBottom: "8px" }}>
            <div
              style={{
                padding: "8px",
                border: "1px dashed #999",
                marginBottom: "4px",
                opacity: 0.85,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>📌 {summary.title}</span>
              <span>
                <button
                  onClick={() => moveSummary(index, -1)}
                  disabled={index === 0}
                  style={{ marginRight: "4px" }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSummary(index, +1)}
                  disabled={index === orderedSummaries.length - 1}
                >
                  ↓
                </button>
              </span>
            </div>

            {(tasksBySummary[summary.id] || []).map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTask(task)}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "6px",
                  marginLeft: "16px",
                  cursor: "pointer",
                }}
              >
                🗂️ {task.title}
              </div>
            ))}
          </div>
        ))}

        {/* Orphan tasks render after summaries (unchanged semantics) */}
        {orphanTasks.map((task) => (
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
      </div>

      <PreProjectFooter
        summaries={summaries}
        onCreateTaskIntent={createTask}
      />

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
