/**
 * =====================================================================
 * METRA — TaskPopup.jsx
 * =====================================================================
 *
 * ROLE
 * ---------------------------------------------------------------------
 * Task-scoped popup.
 *
 * STAGE 53.2 RESPONSIBILITY
 * ---------------------------------------------------------------------
 * - Allow a user to explicitly SELECT a summary
 * - Allow explicit affirmation of NO summary
 * - Selection is UI-only and non-persistent
 *
 * EXPLICIT NON-RESPONSIBILITIES
 * ---------------------------------------------------------------------
 * - Does NOT associate the task
 * - Does NOT mutate task or summary state
 * - Does NOT enforce authority
 * - Does NOT imply workflow, lifecycle, or priority
 *
 * Selection state is discarded on close.
 * =====================================================================
 */

import React, { useState } from "react";

export default function TaskPopup({ task, summaries = [], onClose }) {
  /**
   * Stage 53.2 — Local selection state (UI-only)
   *
   * undefined  → no choice yet
   * null       → explicit "no summary"
   * string     → selected summary id
   */
  const [selectedSummaryId, setSelectedSummaryId] = useState(undefined);

  function handleConfirm() {
    console.log("Stage 53.2 selection intent:", {
      taskId: task.id,
      selectedSummaryId,
    });
  }

  function handleCancel() {
    onClose();
  }

  return (
    <div className="task-popup-overlay">
      <div className="task-popup">
        <h3>Task</h3>

        <p>
          <strong>Title:</strong> {task.title}
        </p>

        <hr />

        <div>
          <strong>Select summary:</strong>

          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {summaries.map((s) => (
              <li key={s.id}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="summary-selection"
                    checked={selectedSummaryId === s.id}
                    onChange={() => setSelectedSummaryId(s.id)}
                  />{" "}
                  {s.title}
                </label>
              </li>
            ))}

            <li>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name="summary-selection"
                  checked={selectedSummaryId === null}
                  onChange={() => setSelectedSummaryId(null)}
                />{" "}
                No summary
              </label>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: "12px" }}>
          <button onClick={handleConfirm}>Confirm Selection</button>{" "}
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
