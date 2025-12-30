// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 32.2 — Summary Instantiation (Explicit Workspace Owner Assumption)

IMPORTANT:
• Temporary single-user workspace assumption
• Workspace owner explicitly assumed TRUE
• This bypasses currentUser timing issues
• To be replaced when workspace ownership is formally modelled

NO persistence
NO behaviour change
NO lifecycle interaction
=====================================================================
*/

const TASK_STORAGE_KEY = "metra.workspace.tasks";
const SUMMARY_STORAGE_KEY = "metra.workspace.summaries";
const SUMMARY_ORDER_STORAGE_KEY = "metra.workspace.summaryOrder";

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [summaryOrder, setSummaryOrder] = useState(null); // advisory
  const [activeTask, setActiveTask] = useState(null);
  const [rehydrationError, setRehydrationError] = useState(null);

  // ------------------------------------------------------------------
  // Stage 32.2 — Explicit workspace owner assumption (TEMPORARY)
  // ------------------------------------------------------------------
  // The workspace is currently single-user.
  // Workspace ownership is therefore assumed for render-gating purposes.
  // This MUST be replaced when workspace authority is formally defined.
  const isWorkspaceOwner = true;

  // ------------------------------------------------------------------
  // Workspace rehydration (tasks + summaries)
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

  // ------------------------------------------------------------------
  // Advisory summary ordering rehydration (fail-closed)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!summaries.length) return;

    try {
      const raw = localStorage.getItem(SUMMARY_ORDER_STORAGE_KEY);
      if (!raw) {
        setSummaryOrder(summaries.map((s) => s.id));
        return;
      }

      const parsed = JSON.parse(raw);
      const order = parsed?.order;

      if (!Array.isArray(order) || new Set(order).size !== order.length) {
        throw new Error("Invalid summary order shape.");
      }

      const summaryIds = summaries.map((s) => s.id);
      const allIdsExist = order.every((id) => summaryIds.includes(id));

      if (!allIdsExist) {
        throw new Error("Summary order contains unknown ids.");
      }

      const completeOrder = [
        ...order,
        ...summaryIds.filter((id) => !order.includes(id)),
      ];

      setSummaryOrder(completeOrder);
    } catch {
      setSummaryOrder(summaries.map((s) => s.id));
    }
  }, [summaries]);

  // ------------------------------------------------------------------
  // Persist advisory summary order (explicit user action only)
  // ------------------------------------------------------------------
  function persistSummaryOrder(nextOrder) {
    try {
      localStorage.setItem(
        SUMMARY_ORDER_STORAGE_KEY,
        JSON.stringify({
          order: nextOrder,
          updatedAt: Date.now(),
        })
      );
    } catch {
      // Advisory persistence only — fail silently
    }
  }

  // ------------------------------------------------------------------
  // Task creation (unchanged semantics)
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
  // Index tasks by summaryId (unchanged semantics)
  // ------------------------------------------------------------------
  const tasksBySummary = {};
  tasks.forEach((task) => {
    if (task.summaryId) {
      if (!tasksBySummary[task.summaryId]) {
        tasksBySummary[task.summaryId] = [];
      }
      tasksBySummary[task.summaryId].push(task);
    }
  });

  Object.values(tasksBySummary).forEach((group) =>
    group.sort((a, b) => a.createdAt - b.createdAt)
  );

  // ------------------------------------------------------------------
  // Resolve ordered summaries (fail closed)
  // ------------------------------------------------------------------
  const orderedSummaries =
    Array.isArray(summaryOrder) && summaryOrder.length
      ? summaryOrder
          .map((id) => summaries.find((s) => s.id === id))
          .filter(Boolean)
      : summaries;

  const orphanTasks = tasks
    .filter((t) => !t.summaryId)
    .sort((a, b) => a.createdAt - b.createdAt);

  // ------------------------------------------------------------------
  // Move handlers — atomic, guarded, reversible + persisted
  // ------------------------------------------------------------------
  function moveSummary(index, direction) {
    if (!Array.isArray(summaryOrder)) return;
    const target = index + direction;
    if (target < 0 || target >= summaryOrder.length) return;

    const next = [...summaryOrder];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;

    setSummaryOrder(next);
    persistSummaryOrder(next);
  }

  // ------------------------------------------------------------------

  return (
    <div style={{ padding: "16px" }}>
      {/* WORKSPACE LIST — advisory persisted ordering */}
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

              {isWorkspaceOwner && (
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
              )}
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
        showCreateSummary={isWorkspaceOwner}
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
