// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 28 — Step 2 (FINAL)
Alignment Semantics — Global Creation Order
=====================================================================
*/

const TASK_STORAGE_KEY = "metra.workspace.tasks";
const SUMMARY_STORAGE_KEY = "metra.workspace.summaries";

export default function PreProject() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [rehydrationError, setRehydrationError] = useState(null);

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

  // Option A: create task once, with optional summaryId
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

  // ------------------------------------------------------------
  // Stage 28 — Step 2
  // Global creation order with summary anchoring
  // ------------------------------------------------------------

  // Index tasks by summaryId
  const tasksBySummary = {};
  tasks.forEach((task) => {
    if (task.summaryId) {
      if (!tasksBySummary[task.summaryId]) {
        tasksBySummary[task.summaryId] = [];
      }
      tasksBySummary[task.summaryId].push(task);
    }
  });

  // Sort linked tasks by creation time
  Object.values(tasksBySummary).forEach((group) =>
    group.sort((a, b) => a.createdAt - b.createdAt)
  );

  // Timeline consists of:
  // • all summaries
  // • all tasks WITHOUT summaryId
  const timeline = [
    ...summaries.map((s) => ({ type: "summary", item: s })),
    ...tasks
      .filter((t) => !t.summaryId)
      .map((t) => ({ type: "task", item: t })),
  ].sort((a, b) => a.item.createdAt - b.item.createdAt);

  // ------------------------------------------------------------

  return (
    <div style={{ padding: "16px" }}>
      {/* WORKSPACE LIST — Stage 28 Step 2 (final semantics) */}
      <div>
        {timeline.map((entry) => {
          if (entry.type === "task") {
            const task = entry.item;
            return (
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
            );
          }

          // summary
          const summary = entry.item;
          return (
            <div key={summary.id} style={{ marginBottom: "8px" }}>
              <div
                style={{
                  padding: "8px",
                  border: "1px dashed #999",
                  marginBottom: "4px",
                  opacity: 0.85,
                }}
              >
                📌 {summary.title}
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
          );
        })}
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
