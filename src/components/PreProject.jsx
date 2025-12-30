// @ts-nocheck
import { useState, useEffect } from "react";
import TaskPopup from "./TaskPopup";
import PreProjectFooter from "./PreProjectFooter";

/*
=====================================================================
METRA — PreProject.jsx
Stage 28 — Step 1
Create Task via Modal (Option A)
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

  return (
    <div style={{ padding: "16px" }}>
      {/* WORKSPACE LIST (unchanged presentation for now) */}
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
