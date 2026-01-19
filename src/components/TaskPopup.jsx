// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Inspection-first task popup with controlled, explicit task mutations.

STAGES
---------------------------------------------------------------------
Stage 148 — Gate G3: Task Assignment Authority (Single-Pane)
Stage 151A — Gate G6: Assignee Start Acknowledgement (Popup-Only)

CONSTRAINTS
---------------------------------------------------------------------
• Inspection-only by default
• Authorised mutations here:
    - Gate G3 assignment (one-shot, explicit)
    - Gate G6 execution start (assignee-only)
• No reassignment
• No completion
• No workspace signalling
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
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  if (!task) return null;

  const isAssigned = Boolean(task.assigneeId);

  // Normalise executionState for comparison only
  const executionState =
    (task.executionState || "NOT_STARTED").replace(" ", "_");

  // Simplified identity convention for current stage
  const isAssignee = task.assigneeId === "current-user";

  const canStartExecution =
    isAssigned &&
    isAssignee &&
    executionState === "NOT_STARTED";

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

  function handleConfirmNote() {
    if (!noteDraft.trim()) return;
    onAddNote(task.id, noteDraft.trim());
    setNoteDraft("");
    setIsAddingNote(false);
  }

  function handleCancelNote() {
    setNoteDraft("");
    setIsAddingNote(false);
  }

  function handleStartWork() {
    if (!canStartExecution) return;
    onStartExecution(task.id);
  }

  return (
    <>
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

          {!isAddingNote && (
            <button onClick={() => setIsAddingNote(true)}>
              Add note
            </button>
          )}

          {isAddingNote && (
            <div>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
              />
              <button onClick={handleConfirmNote}>Save note</button>
              <button onClick={handleCancelNote}>Cancel</button>
            </div>
          )}

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}
