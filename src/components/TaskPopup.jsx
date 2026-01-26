// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 211 — Behavioural Reinstatement (Concern-Complete)
---------------------------------------------------------------------
Applied onto:
baseline-2026-01-26-stage210-taskpopup-reauthorised

AUTHORITISED CONCERNS:
• Concern 1 — System-authored execution note on "Start work"
• Concern 4 — Immediate in-popup visual reflection of assignment
               and execution state (local, ephemeral mirror)

SCOPE (STRICT):
• TaskPopup only
• No parent changes
• No authority delegation
• No new lifecycle states
• No background refresh
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

  /* ---------------- Local UI mirrors (Concern 4) ---------------- */

  const [localAssigneeId, setLocalAssigneeId] = useState(task.assigneeId);
  const [localExecutionState, setLocalExecutionState] = useState(
    task.executionState || "NOT_STARTED"
  );

  /* ---------------- Assignment ---------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const isAssigned = Boolean(localAssigneeId);

  function handleConfirmAssignment() {
    if (!selectedAssigneeId) return;

    onAssignTask(task.id, selectedAssigneeId);

    // Immediate visual reflection (local mirror)
    setLocalAssigneeId(selectedAssigneeId);

    setSelectedAssigneeId("");
    setAssigning(false);
  }

  function handleCancelAssignment() {
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  /* ---------------- Execution start ---------------- */

  const executionState =
    (localExecutionState || "NOT_STARTED").replace(" ", "_");

  const isAssignee = localAssigneeId === "current-user";

  const canStartExecution =
    isAssigned &&
    isAssignee &&
    executionState === "NOT_STARTED";

  function handleStartWork() {
    if (!canStartExecution) return;

    // Concern 1: explicit system-authored execution note
    onAddNote(task.id, "[System] Execution started");

    // Existing execution trigger
    onStartExecution(task.id);

    // Immediate visual reflection (local mirror)
    setLocalExecutionState("IN_PROGRESS");
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
          <CanonicalTaskPopupHeader
            task={{
              ...task,
              assigneeId: localAssigneeId,
              executionState: localExecutionState,
            }}
          />
        </div>

        {/* ---------------- Body ---------------- */}
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
              {task.assigneeLabel || localAssigneeId}
            </div>
          )}

          {canStartExecution && (
            <div style={{ marginTop: "16px" }}>
              <button onClick={handleStartWork}>
                Start work
              </button>
            </div>
          )}

          {/* Notes */}
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

          {/* Draft */}
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

        {/* ---------------- Footer ---------------- */}
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
