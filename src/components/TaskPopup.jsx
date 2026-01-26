// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 210 — Notes Dominance Refinement (Concern 3)
---------------------------------------------------------------------
Applied onto:
baseline-2026-01-22-stage184-summary-wiring-visibility

SCOPE (STRICT):
• Notes visual dominance and readability only
• Spacing and rhythm refinements
• NO behavioural changes
• NO logic changes
• NO header or footer changes
=====================================================================
*/

import { useState } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import { localAssignees } from "../data/localAssignees";

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
  onAssignTask,
  onStartExecution,
  onChangeTaskSummary,
}) {
  if (!task) return null;

  /* ---------------- Assignment (unchanged) ---------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const isAssigned = Boolean(task.assigneeId);

  function handleConfirmAssignment() {
    if (!selectedAssigneeId) return;
    onAssignTask(task.id, selectedAssigneeId);
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  function handleCancelAssignment() {
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  /* ---------------- Execution start (unchanged) ---------------- */

  const executionState =
    (task.executionState || "NOT_STARTED").replace(" ", "_");

  const isAssignee = task.assigneeId === "current-user";

  const canStartExecution =
    isAssigned &&
    isAssignee &&
    executionState === "NOT_STARTED";

  function handleStartWork() {
    if (!canStartExecution) return;
    onStartExecution(task.id);
  }

  /* ---------------- Notes (Stage 200 canon) ---------------- */

  const [draftText, setDraftText] = useState("");

  function commitDraft() {
    const text = draftText.trim();
    if (!text) return;
    onAddNote(task.id, text);
    setDraftText("");
  }

  function handleClose() {
    setDraftText("");
    onClose();
  }

  /* ---------------- Render ---------------- */

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "520px",
          maxHeight: "80vh",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ---------------- Header ---------------- */}
        <div
          style={{
            padding: "14px 16px",
            background: "#fafafa",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <CanonicalTaskPopupHeader task={task} />
        </div>

        {/* ---------------- Body (Notes-dominant) ---------------- */}
        <div
          style={{
            padding: "20px 16px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {!isAssigned && !assigning && (
            <button onClick={() => setAssigning(true)}>
              Assign task
            </button>
          )}

          {!isAssigned && assigning && (
            <div style={{ marginTop: "12px" }}>
              <select
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
              >
                <option value="">— Select —</option>
                {localAssignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "8px" }}>
                <button
                  disabled={!selectedAssigneeId}
                  onClick={handleConfirmAssignment}
                >
                  Confirm assignment
                </button>
                <button onClick={handleCancelAssignment}>
                  Cancel
                </button>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#555",
                }}
              >
                Assignment locks task identity and cannot be undone.
              </div>
            </div>
          )}

          {isAssigned && (
            <div style={{ marginTop: "12px" }}>
              <strong>Assigned:</strong>{" "}
              {task.assigneeLabel || task.assigneeId}
            </div>
          )}

          {canStartExecution && (
            <div style={{ marginTop: "16px" }}>
              <button onClick={handleStartWork}>
                Start work
              </button>
            </div>
          )}

          {/* Notes content */}
          <div style={{ marginTop: "20px" }}>
            <strong style={{ display: "block", marginBottom: "6px" }}>
              Notes
            </strong>

            <div style={{ lineHeight: "1.5" }}>
              {Array.isArray(task.notes) &&
                task.notes.map((n, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    {n}
                  </div>
                ))}
            </div>
          </div>

          {/* Draft + commit */}
          <div style={{ marginTop: "16px" }}>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Draft note (not committed)"
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: "6px" }}>
              <button onClick={commitDraft}>
                Commit note
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Footer (Actions only) ---------------- */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #eee",
          }}
        >
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
