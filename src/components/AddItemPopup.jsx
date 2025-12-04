/* ======================================================================
   METRA – AddItemPopup.jsx
   v3.0 – Add Task + Summary Selection (Future-Ready)
   ----------------------------------------------------------------------
   ✔ User enters task title
   ✔ User optionally selects a Summary to attach the task to
   ✔ Dropdown order:
        None
        All summaries (sorted by createdAt)
   ✔ Returns:
        { title, summaryId }
   ✔ Styled to match TaskPopup + SummaryOverlay
   ====================================================================== */

import React, { useState } from "react";
import "../Styles/TaskPopup.css";     // reuse overlay + dimming
import "../Styles/SummaryOverlay.css"; // reuse clean header/body/footer if needed

export default function AddItemPopup({ onAdd, onClose, summaries = [] }) {
  const [title, setTitle] = useState("");
  const [summaryId, setSummaryId] = useState(null);   // null = no summary

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      summaryId: summaryId ? Number(summaryId) : null
    });

    onClose();
  };

  // Sort summaries newest-first or A-Z:
  const sortedSummaries = [...summaries].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div className="taskpopup-overlay" onClick={onClose}>
      <div
        className="summary-window"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="summary-header">
          <h3 className="summary-header-title">Add Task</h3>
          <button className="summary-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="summary-body">

          {/* Task Title */}
          <label className="summary-label">Task Title:</label>
          <input
            type="text"
            className="summary-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name…"
          />

          {/* Summary Selection */}
          <label className="summary-label" style={{ marginTop: "10px" }}>
            Attach to Summary:
          </label>

          <select
            className="summary-input"
            value={summaryId || ""}
            onChange={(e) =>
              setSummaryId(e.target.value === "" ? null : e.target.value)
            }
          >
            {/* NONE first */}
            <option value="">None</option>

            {/* Summary options */}
            {sortedSummaries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

        </div>

        {/* FOOTER */}
        <div className="summary-footer">
          <button className="summary-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="summary-btn add" onClick={handleSubmit}>
            Add Task
          </button>
        </div>

      </div>
    </div>
  );        
}
              