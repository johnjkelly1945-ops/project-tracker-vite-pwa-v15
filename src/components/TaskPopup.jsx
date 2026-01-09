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
Stage 55   — Controlled Action Reintroduction (Notes)
Stage 60.1 — Assignment Modal Wiring
Stage 83.2 — Canonical Popup Header
Stage 97.3.2 — Task ↔ Summary Reassignment (Move)

CONSTRAINTS
---------------------------------------------------------------------
• Inspection-only by default
• Authorised mutations here:
    - Append-only notes
    - Assignment (delegated)
    - Summary reassignment (delegated)
• No lifecycle, governance, or escalation authority
=====================================================================
*/

import { useState } from "react";
import AssignmentModal from "./AssignmentModal";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
  onAssignTask,
  onChangeTaskSummary,
}) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");

  /* ================= MOVE (STAGE 97.3.2) ================= */
  const [moveOpen, setMoveOpen] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] = useState(
    task?.summaryId ?? ""
  );

  if (!task) return null;

  /* ================= ASSIGNMENT ================= */

  function handleConfirmAssignment() {
    if (!selectedAssignee) return;
    onAssignTask(task.id, selectedAssignee);
    setSelectedAssignee("");
    setAssignOpen(false);
  }

  function handleCancelAssignment() {
    setSelectedAssignee("");
    setAssignOpen(false);
  }

  /* ================= NOTES ================= */

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

  /* ================= MOVE ================= */

  function handleConfirmMove() {
    const newSummaryId =
      selectedSummaryId === "" ? null : selectedSummaryId;
    onChangeTaskSummary(task.id, newSummaryId);
    setMoveOpen(false);
  }

  function handleCancelMove() {
    setSelectedSummaryId(task.summaryId ?? "");
    setMoveOpen(false);
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

          <div>
            <strong>Notes</strong>
            {Array.isArray(task.notes) &&
              task.notes.map((n, i) => <div key={i}>{n}</div>)}
          </div>

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

          {moveOpen && (
            <div style={{ marginTop: "12px" }}>
              <strong>Move task</strong>
              <select
                value={selectedSummaryId}
                onChange={(e) => setSelectedSummaryId(e.target.value)}
              >
                <option value="">No summary</option>
                {summaries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <button onClick={handleConfirmMove}>Apply</button>
              <button onClick={handleCancelMove}>Cancel</button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setAssignOpen(true)}>
              Change person
            </button>

            {!isAddingNote && (
              <button onClick={() => setIsAddingNote(true)}>
                Add note
              </button>
            )}

            {!moveOpen && (
              <button
                onClick={() => {
                  setSelectedSummaryId(task.summaryId ?? "");
                  setMoveOpen(true);
                }}
              >
                Move
              </button>
            )}

            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      <AssignmentModal
        isOpen={assignOpen}
        currentAssignee={task.assignedTo || ""}
        selectedAssignee={selectedAssignee}
        onSelectAssignee={setSelectedAssignee}
        onConfirm={handleConfirmAssignment}
        onClose={handleCancelAssignment}
      />
    </>
  );
}
