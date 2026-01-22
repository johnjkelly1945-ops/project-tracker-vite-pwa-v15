// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 188 — Task ↔ Summary Association (Execution Only)
---------------------------------------------------------------------
CHANGE (STAGE 188):
• Explicit Task → Summary association via popup
• Association is task-owned and user-confirmed
• Stored as task.summaryId via onChangeTaskSummary
• No movement, grouping, filtering, or hierarchy introduced

INVARIANTS (PRESERVED):
• Inspection-first popup
• Existing assignment (G3) and execution start (G6) unchanged
• No lifecycle or authority expansion
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

  // Stage 188 — summary association UI state
  const [associatingSummary, setAssociatingSummary] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] = useState(
    task.summaryId || ""
  );

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

  // Stage 188 — confirm association
  function handleConfirmSummaryAssociation() {
    if (!selectedSummaryId) return;
    onChangeTaskSummary(task.id, selectedSummaryId);
    setAssociatingSummary(false);
  }

  function handleCancelSummaryAssociation() {
    setSelectedSummaryId(task.summaryId || "");
    setAssociatingSummary(false);
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

          {/* ================= G3 ASSIGNMENT ================= */}
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

          {/* ================= STAGE 188 — SUMMARY ASSOCIATION ================= */}
          <div style={{ marginTop: "12px" }}>
            <strong>Summary</strong>
            {!associatingSummary && (
              <div style={{ marginTop: "6px" }}>
                <div style={{ fontSize: "14px" }}>
                  {task.summaryId
                    ? summaries.find((s) => s.id === task.summaryId)?.title ||
                      "Associated summary"
                    : "Not associated"}
                </div>
                <button
                  style={{ marginTop: "6px" }}
                  onClick={() => setAssociatingSummary(true)}
                >
                  Associate with summary
                </button>
              </div>
            )}

            {associatingSummary && (
              <div style={{ marginTop: "6px" }}>
                <select
                  value={selectedSummaryId}
                  onChange={(e) => setSelectedSummaryId(e.target.value)}
                >
                  <option value="">— Select summary —</option>
                  {summaries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: "6px" }}>
                  <button
                    disabled={!selectedSummaryId}
                    onClick={handleConfirmSummaryAssociation}
                  >
                    Confirm association
                  </button>
                  <button onClick={handleCancelSummaryAssociation}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= G6 EXECUTION START ================= */}
          {canStartExecution && (
            <div style={{ marginTop: "12px" }}>
              <button onClick={handleStartWork}>
                Start work
              </button>
            </div>
          )}

          {/* ================= NOTES ================= */}
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
