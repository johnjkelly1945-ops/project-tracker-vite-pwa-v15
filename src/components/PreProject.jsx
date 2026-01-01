// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 37 — Summary Visibility (Render-Only Implementation)

BASED ON:
Stage 35 — Persist existence-only Summary Shell

CONSTRAINTS (LOCKED):
• Render-only
• No activation
• No selection
• No focus
• No interaction
• No ordering mutation
• No task association
• No persistence changes
• Fail-closed

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
  // Resolve ordered summaries (fail-closed)
  // ------------------------------------------------------------------
  const orderedSummaries =
    Array.isArray(summaryOrder) && summaryOrder.length
      ? summaryOrder
          .map((id) => summaries.find((s) => s.id === id))
          .filter(Boolean)
      : summaries;

  // ------------------------------------------------------------------
  // STAGE 37 — RENDER ONLY
  // ------------------------------------------------------------------
  // • Summaries visible
  // • No arrows
  // • No task grouping
  // • No interaction
  // ------------------------------------------------------------------

  return (
    <div style={{ padding: "16px" }}>
      <div>
        {orderedSummaries.map((summary) => (
          <div key={summary.id} style={{ marginBottom: "8px" }}>
            <div
              style={{
                padding: "8px",
                border: "1px dashed #999",
                marginBottom: "4px",
                opacity: 0.6,
              }}
            >
              <span>📌 {summary.title}</span>
            </div>
          </div>
        ))}

        {/* Tasks intentionally NOT rendered in Stage 37 */}
      </div>

      <PreProjectFooter
        summaries={summaries}
        onCreateTaskIntent={createTask}
        showCreateSummary={isWorkspaceOwner}
      />

      {/* TaskPopup intentionally unreachable in Stage 37 */}
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
