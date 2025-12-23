/* ======================================================================
   METRA – AddItemPopup.jsx
   Stage 12.6-A – Task Creation with Optional Summary Assignment (Mgmt)
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Create summaries (unchanged)
   • Create tasks (extended)
   • Emit explicit user intent only
   • No execution authority
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/AddItemPopup.css";

export default function AddItemPopup({
  type,                 // "task" | "summary"
  onCancel,
  onConfirm,
  workspaceSummaries = [] // <-- NEW (mgmt summaries only)
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summaryId, setSummaryId] = useState(null); // <-- NEW

  const isTask = type === "task";

  const handleConfirm = () => {
    if (!title.trim()) return;

    if (isTask) {
      onConfirm({
        title: title.trim(),
        description: description.trim(),
        summaryId: summaryId || null // explicit orphan if null
      });
    } else {
      onConfirm({
        title: title.trim()
      });
    }

    // reset local state
    setTitle("");
    setDescription("");
    setSummaryId(null);
  };

  return (
    <div className="add-item-overlay">
      <div className="add-item-popup">

        <h2>
          {isTask ? "Add Task" : "Add Summary"}
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder={isTask ? "Task title" : "Summary title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        {/* Description (tasks only) */}
        {isTask && (
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}

        {/* Summary assignment (tasks only) */}
        {isTask && (
          <div className="add-item-field">
            <label>Assign to summary (optional)</label>
            <select
              value={summaryId || ""}
              onChange={(e) =>
                setSummaryId(e.target.value || null)
              }
            >
              <option value="">Unassigned</option>
              {workspaceSummaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="add-item-actions">
          <button onClick={onCancel}>
            Cancel
          </button>
          <button onClick={handleConfirm}>
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
