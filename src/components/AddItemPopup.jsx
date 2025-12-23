import { useState, useEffect } from "react";

/**
 * AddItemPopup
 *
 * Modes:
 * - "add-task"   (existing behaviour)
 * - "reassign"   (Stage 12.6-C)
 *
 * Emits intent only.
 * Workspace remains sole execution authority.
 */

export default function AddItemPopup({
  mode = "add-task",

  // Shared
  summaries = [],
  tasks = [],
  onCancel,

  // Add-task props
  onConfirm,
  defaultSummaryId = null,

  // Reassign props
  onReassign
}) {
  /* ------------------------------
     Shared state
  ------------------------------ */
  const [selectedSummaryId, setSelectedSummaryId] =
    useState(defaultSummaryId);

  /* ------------------------------
     Add-task state
  ------------------------------ */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /* ------------------------------
     Reassign state
  ------------------------------ */
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask =
    tasks.find(t => t.id === selectedTaskId) || null;

  /* ------------------------------
     Initialise by mode
  ------------------------------ */
  useEffect(() => {
    if (mode === "add-task") {
      setSelectedSummaryId(defaultSummaryId ?? null);
      setSelectedTaskId(null);
    }

    if (mode === "reassign") {
      setSelectedSummaryId(null);
      setSelectedTaskId(null);
    }
  }, [mode, defaultSummaryId]);

  /* ------------------------------
     Handlers
  ------------------------------ */
  function handleConfirm() {
    if (mode === "add-task") {
      onConfirm?.({
        title,
        description,
        summaryId: selectedSummaryId
      });
      return;
    }

    if (mode === "reassign" && selectedTask) {
      onReassign?.({
        type: "reassign-task",
        taskId: selectedTask.id,
        fromSummaryId: selectedTask.summaryId ?? null,
        toSummaryId: selectedSummaryId ?? null
      });
    }
  }

  /* ------------------------------
     Render helpers
  ------------------------------ */
  function renderSummaryOptions() {
    return (
      <>
        <option value="">Unassigned</option>
        {summaries.map(summary => (
          <option key={summary.id} value={summary.id}>
            {summary.title}
          </option>
        ))}
      </>
    );
  }

  function renderTaskOptions() {
    return (
      <>
        <option value="">Select task…</option>
        {tasks.map(task => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </>
    );
  }

  /* ------------------------------
     Render
  ------------------------------ */
  return (
    <div className="popup">
      <h3>
        {mode === "reassign" ? "Reassign Task" : "Add Task"}
      </h3>

      {mode === "add-task" && (
        <>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </>
      )}

      {mode === "reassign" && (
        <>
          <label>
            Select task
            <select
              value={selectedTaskId ?? ""}
              onChange={e =>
                setSelectedTaskId(
                  e.target.value === ""
                    ? null
                    : e.target.value
                )
              }
            >
              {renderTaskOptions()}
            </select>
          </label>

          {selectedTask && (
            <p>
              <strong>Current summary:</strong>{" "}
              {selectedTask.summaryId
                ? summaries.find(
                    s => s.id === selectedTask.summaryId
                  )?.title || "Unknown"
                : "Unassigned"}
            </p>
          )}
        </>
      )}

      <label>
        Assign to summary (optional)
        <select
          value={selectedSummaryId ?? ""}
          onChange={e =>
            setSelectedSummaryId(
              e.target.value === "" ? null : e.target.value
            )
          }
        >
          {renderSummaryOptions()}
        </select>
      </label>

      <div className="popup-actions">
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={handleConfirm}
          disabled={mode === "reassign" && !selectedTask}
        >
          {mode === "reassign"
            ? "Confirm Reassignment"
            : "Confirm"}
        </button>
      </div>
    </div>
  );
}
