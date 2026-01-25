// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 200 (Recovered) — Canonical Notes Commit Semantics
---------------------------------------------------------------------
Applied onto:
baseline-2026-01-22-stage184-summary-wiring-visibility

CANON:
• Single draft surface
• Explicit commit only
• Close is inert (no commit)
• Ledger authority remains with parent
• No duplication
• No execution lifecycle expansion
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
          overflowY: "auto",
          borderRadius: "6px",
          padding: "16px",
        }}
      >
        <CanonicalTaskPopupHeader task={task} />

        {!isAssigned && !assigning && (
          <button onClick={() => setAssigning(true)}>
            Assign task
          </button>
        )}

        {!isAssigned && assigning && (
          <div style={{ marginTop: "8px" }}>
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

            <div style={{ marginTop: "6px" }}>
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

            <div style={{ marginTop: "6px", fontSize: "12px", color: "#555" }}>
              Assignment locks task identity and cannot be undone.
            </div>
          </div>
        )}

        {isAssigned && (
          <div style={{ marginTop: "8px" }}>
            <strong>Assigned:</strong>{" "}
            {task.assigneeLabel || task.assigneeId}
          </div>
        )}

        {canStartExecution && (
          <div style={{ marginTop: "12px" }}>
            <button onClick={handleStartWork}>
              Start work
            </button>
          </div>
        )}

        <div style={{ marginTop: "12px" }}>
          <strong>Notes</strong>
          {Array.isArray(task.notes) &&
            task.notes.map((n, i) => <div key={i}>{n}</div>)}
        </div>

        <div style={{ marginTop: "12px" }}>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Draft note (not committed)"
            style={{ width: "100%" }}
          />
          <button onClick={commitDraft}>
            Commit note
          </button>
        </div>

        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
