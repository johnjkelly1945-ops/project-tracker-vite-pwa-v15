// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 239 — Task → Summary Association (Canonical Closure Fix)
---------------------------------------------------------------------
• Summary association closes popup to prevent stale task reference
• No new semantics introduced
• Footer authority matrix preserved
• Notes remain readable post-completion
=====================================================================
*/

import { useState, useEffect } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import { localAssignees } from "../data/localAssignees";

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
  onAssignTask,
  onStartExecution,
  onSubmitExecution,
  onCompleteExecution,
  onChangeTaskSummary,
  onArchiveTask,
  currentUserRole = "PM",
}) {
  if (!task) return null;

  const [displayNotes, setDisplayNotes] = useState(task.notes || []);
  const [localAssigneeId, setLocalAssigneeId] = useState(task.assigneeId || "");

  useEffect(() => {
    setDisplayNotes(task.notes || []);
  }, [task.notes]);

  /* ---------------- Assignment ---------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  function openAssign() {
    setSelectedAssigneeId("");
    setAssigning(true);
  }

  function cancelAssignment() {
    setAssigning(false);
    setSelectedAssigneeId("");
  }

  function confirmAssignment() {
    if (!selectedAssigneeId) return;

    const assignee = localAssignees.find((a) => a.id === selectedAssigneeId);
    const isReassign = Boolean(localAssigneeId);

    onAssignTask(task.id, selectedAssigneeId);
    setLocalAssigneeId(selectedAssigneeId);

    const label = assignee?.displayName || selectedAssigneeId;
    const line = systemLine(
      isReassign
        ? `Task reassigned to ${label}`
        : `Task assigned to ${label}`
    );

    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);

    setAssigning(false);
    setSelectedAssigneeId("");
  }

  /* ---------------- Execution authority ---------------- */

  const executionState = task.executionState || "NOT_STARTED";
  const isCompleted = executionState === "COMPLETED";

  const isAssigned = Boolean(localAssigneeId);
  const isAssignee = localAssigneeId === "current-user";
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

  /* ---------------- Archive ---------------- */

  const [confirmArchive, setConfirmArchive] = useState(false);

  /* ---------------- Render ---------------- */

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >
        <CanonicalTaskPopupHeader task={task} onClose={onClose} />

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <strong>Notes</strong>
          {displayNotes.map((line, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div>
            {!isCompleted && !assigning && (
              <button onClick={openAssign}>Assign</button>
            )}

            {!isCompleted && assigning && (
              <>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
                >
                  <option value="">Select assignee</option>
                  {localAssignees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.displayName}
                    </option>
                  ))}
                </select>
                <button onClick={confirmAssignment}>Confirm</button>
                <button onClick={cancelAssignment}>Cancel</button>
              </>
            )}

            {!isCompleted && !summaryEditing && (
              <button onClick={openSummaryEdit}>
                Associate with summary
              </button>
            )}

            {!isCompleted && summaryEditing && (
              <>
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
                <button onClick={confirmSummaryEdit}>Confirm</button>
                <button onClick={cancelSummaryEdit}>Cancel</button>
              </>
            )}

            <button onClick={openNoteModal}>Add note</button>
          </div>

          <div>
            {showStart && <button onClick={handleStartWork}>Start</button>}
            {showSubmit && (
              <button onClick={handleSubmitWork}>Submit</button>
            )}
            {showComplete && (
              <button onClick={handleCompleteWork}>Complete</button>
            )}

            {!confirmArchive && (
              <button onClick={() => setConfirmArchive(true)}>
                Delete
              </button>
            )}

            {confirmArchive && (
              <>
                <span>Archive task?</span>
                <button onClick={() => onArchiveTask(task.id)}>
                  Confirm
                </button>
                <button onClick={() => setConfirmArchive(false)}>
                  Cancel
                </button>
              </>
            )}

            <button onClick={onClose}>Close</button>
          </div>
        </div>

        {noteModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1100,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "6px",
                width: "400px",
              }}
            >
              <h3>Add note</h3>
              <textarea
                rows={4}
                style={{ width: "100%" }}
                value={modalDraftText}
                onChange={(e) => setModalDraftText(e.target.value)}
              />
              <div style={{ marginTop: "10px" }}>
                <button onClick={commitNoteDraft}>Add</button>
                <button onClick={cancelNoteDraft}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
