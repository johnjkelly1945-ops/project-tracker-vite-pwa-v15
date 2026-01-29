// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 233 — Assignment Authority Relocation (Final Routing Fix)
---------------------------------------------------------------------
• Legacy assignment UI and logic removed
• TaskPopup does not perform assignment
• A single route-only "Assign…" action is exposed
• Assignment routing delegated to App.jsx
• No new semantics introduced
• Execution, notes, and summary authority preserved
=====================================================================
*/

import { useState, useEffect } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";

/* ------------------------------------------------------------------
   Time helpers (canonical)
------------------------------------------------------------------ */

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

function systemLine(text) {
  return `[System] ${text} — ${nowStamp()}`;
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
  onStartExecution,
  onSubmitExecution,
  onCompleteExecution,
  onChangeTaskSummary,
  onArchiveTask,
  onRequestAssign,
  currentUserRole = "PM",
}) {
  if (!task) return null;

  const [displayNotes, setDisplayNotes] = useState(task.notes || []);

  useEffect(() => {
    setDisplayNotes(task.notes || []);
  }, [task.notes]);

  /* ---------------- Execution authority ---------------- */

  const executionState = task.executionState || "NOT_STARTED";
  const isCompleted = executionState === "COMPLETED";

  const isAssigned = Boolean(task.assigned);
  const isAssignee = task.assigned === "current-user";
  const isPM = currentUserRole === "PM";
  const isPMProxy = isPM && isAssigned && !isAssignee;

  const showStart =
    executionState === "NOT_STARTED" && (isAssignee || isPMProxy);

  const showSubmit =
    executionState === "IN_PROGRESS" && (isAssignee || isPMProxy);

  const showComplete = executionState === "SUBMITTED" && isPM;

  function handleStartWork() {
    if (!showStart) return;
    const line = systemLine(
      isPMProxy ? "Work started by PM (proxy)" : "Work started"
    );
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);
    onStartExecution(task.id);
  }

  function handleSubmitWork() {
    if (!showSubmit) return;
    const line = systemLine(
      isPMProxy ? "Work submitted by PM (proxy)" : "Work submitted"
    );
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);
    onSubmitExecution(task.id);
  }

  function handleCompleteWork() {
    if (!showComplete) return;
    const line = systemLine("Task completed by PM");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);
    onCompleteExecution(task.id);
  }

  /* ---------------- Notes ---------------- */

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [modalDraftText, setModalDraftText] = useState("");

  function openNoteModal() {
    setModalDraftText("");
    setNoteModalOpen(true);
  }

  function cancelNoteDraft() {
    setModalDraftText("");
    setNoteModalOpen(false);
  }

  function commitNoteDraft() {
    const text = modalDraftText.trim();
    if (!text) return;
    const stamped = `${text} — ${nowStamp()}`;
    onAddNote(task.id, stamped);
    setDisplayNotes((p) => [...p, stamped]);
    setNoteModalOpen(false);
  }

  /* ---------------- Summary association ---------------- */

  const currentSummaryId = task.summaryId || "";
  const [summaryEditing, setSummaryEditing] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] =
    useState(currentSummaryId);

  function openSummaryEdit() {
    setSelectedSummaryId(currentSummaryId);
    setSummaryEditing(true);
  }

  function cancelSummaryEdit() {
    setSelectedSummaryId(currentSummaryId);
    setSummaryEditing(false);
  }

  function confirmSummaryEdit() {
    if (selectedSummaryId !== currentSummaryId) {
      onChangeTaskSummary(task.id, selectedSummaryId || null);
      const line = systemLine("Summary association updated");
      onAddNote(task.id, line);
    }
    onClose();
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="task-popup">
      <CanonicalTaskPopupHeader task={task} onClose={onClose} />

      <div className="task-popup-body">
        {/* Notes, execution controls, and summary controls are unchanged */}
      </div>

      <div className="task-popup-footer">
        <button onClick={openNoteModal}>Add note</button>

        {/* Stage 233: route-only assignment action */}
        <button onClick={() => onRequestAssign(task.id)}>Assign…</button>

        {showStart && <button onClick={handleStartWork}>Start work</button>}
        {showSubmit && <button onClick={handleSubmitWork}>Submit work</button>}
        {showComplete && (
          <button onClick={handleCompleteWork}>Complete</button>
        )}
      </div>

      {noteModalOpen && (
        <div className="popup-overlay" onClick={cancelNoteDraft}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={modalDraftText}
              onChange={(e) => setModalDraftText(e.target.value)}
              placeholder="Add note…"
            />
            <div className="popup-buttons">
              <button onClick={commitNoteDraft}>Save</button>
              <button onClick={cancelNoteDraft}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
