// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Inspection-first task popup with controlled, append-only note entry.

STAGE
---------------------------------------------------------------------
Stage 55 — Controlled Action Reintroduction (55.3)
Stage 60.1 — Assignment Modal Wiring (Authoritative Commit)

CONSTRAINTS
---------------------------------------------------------------------
• Inspection-only by default
• Only authorised mutation here: append-only notes
• Assignment execution delegated upward
• No lifecycle, governance, or escalation authority
=====================================================================
*/

import { useState } from "react";
import AssignmentModal from "./AssignmentModal";

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
  onAssignTask,
}) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");

  if (!task) return null;

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

  return (
    <>
      {/* ================= POPUP ================= */}
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
          <h2>{task.title}</h2>

          {/* ================= NOTES ================= */}
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

          {/* ================= FOOTER ================= */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setAssignOpen(true)}>
              Change person
            </button>

            {!isAddingNote && (
              <button onClick={() => setIsAddingNote(true)}>
                Add note
              </button>
            )}

            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      {/* ================= ASSIGNMENT MODAL ================= */}
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
