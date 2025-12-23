import { useState } from "react";

/*
=====================================================================
METRA — AddItemPopup.jsx
Stage 12.7-B — Add Task (Optional Assignment)

Modes:
• add-task
• reassign
=====================================================================
*/

export default function AddItemPopup({
  mode,
  tasks = [],
  summaries = [],
  onConfirm,
  onReassign,
  onCancel
}) {
  /* ------------------------------
     Add Task state
  ------------------------------ */
  const [title, setTitle] = useState("");
  const [summaryId, setSummaryId] = useState("");

  /* ------------------------------
     Reassign state
  ------------------------------ */
  const [taskId, setTaskId] = useState("");
  const [toSummaryId, setToSummaryId] = useState("");

  /* ------------------------------
     Handlers
  ------------------------------ */
  function confirmAddTask() {
    if (!title.trim()) return;

    onConfirm({
      title: title.trim(),
      summaryId: summaryId || null
    });
  }

  function confirmReassign() {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    onReassign({
      taskId,
      fromSummaryId: task.summaryId ?? null,
      toSummaryId: toSummaryId || null
    });
  }

  /* ------------------------------
     Render
  ------------------------------ */
  return (
    <div className="metra-popup">
      {mode === "add-task" && (
        <>
          <h3>Add Task</h3>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          {summaries.length > 0 && (
            <select
              value={summaryId}
              onChange={e => setSummaryId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {summaries.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          )}

          <button onClick={confirmAddTask}>Create Task</button>
          <button onClick={onCancel}>Cancel</button>
        </>
      )}

      {mode === "reassign" && (
        <>
          <h3>Reassign Task</h3>

          <select
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
          >
            <option value="">Select task</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <select
            value={toSummaryId}
            onChange={e => setToSummaryId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {summaries.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button onClick={confirmReassign}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </>
      )}
    </div>
  );
}
