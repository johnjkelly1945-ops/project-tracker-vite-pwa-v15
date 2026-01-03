/**
 * =====================================================================
 * METRA — TaskPopup.jsx
 * =====================================================================
 *
 * ROLE
 * ---------------------------------------------------------------------
 * Task-scoped popup.
 *
 * STAGE 53.3 RESPONSIBILITY
 * ---------------------------------------------------------------------
 * - Enforce authority at the moment of confirmation
 * - Authority enforcement is SILENT and FAIL-CLOSED
 *
 * EXPLICIT NON-RESPONSIBILITIES
 * ---------------------------------------------------------------------
 * - Does NOT reveal authority state
 * - Does NOT disable controls
 * - Does NOT mutate task or summary state
 * - Does NOT associate task to summary
 * - Does NOT log user-visible errors
 * - Does NOT change UX on denial
 *
 * SEM APPLICABILITY (IN FORCE)
 * ---------------------------------------------------------------------
 * • SEM-05 — Task / Summary Independence
 * • SEM-44.x — Authority semantics (fail-closed, non-discoverable)
 * • SEM-45.x — Behavioural non-implication
 * • SEM-51.x — Association atomicity
 *
 * Selection state remains UI-only and is discarded on close.
 * =====================================================================
 */

import React, { useState } from "react";

/**
 * Authority decision stub.
 *
 * DESIGN NOTE:
 * - Stage 53.3 CONSULTS authority; it does not define it.
 * - This stub intentionally returns true.
 * - Replacement with real authority logic must preserve
 *   fail-closed and non-discoverable semantics.
 */
function canAssociateTask(/* task, userContext */) {
  return true; // STUB — replace later with real authority check
}

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
    // ---------------- AUTHORITY GATE (STAGE 53.3) ----------------
    const authorised = canAssociateTask(/* task, userContext */);

    if (!authorised) {
      // FAIL-CLOSED:
      // - Do nothing
      // - Do not mutate state
      // - Do not close popup
      // - Do not log
      // - Do not signal denial
      return;
    }

    // AUTHORISED PATH (NO MUTATION YET):
    // Stage 53.3 does not apply association.
    // Selection intent remains conceptual only.
    console.log("Stage 53.3 authorised selection intent:", {
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
