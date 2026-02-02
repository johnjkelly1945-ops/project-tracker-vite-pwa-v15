// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 239 — Task → Summary Association (Canonical Closure Fix)
Stage 246 — Phase 1: Assignment Selection Modal (UI Only)
Stage 249 — Governance Controls Restoration (UI ONLY)
---------------------------------------------------------------------
• Governance controls present in popup footer (UI only, UNWIRED)
• Two-line footer:
    Line 1 — Governance (CC / Risk / Issue / QC | Escalate)
    Line 2 — Operational (existing controls unchanged)
• Footer remains sole mutating authority
• NO semantic, lifecycle, or authority changes
=====================================================================
*/

import { useState, useEffect } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
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

  /* ================= Assignment — Stage 246 Phase 1 ================= */

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);

  function handleSelectAssignee(person) {
    const isReassign = Boolean(localAssigneeId);

    onAssignTask(task.id, person.id);
    setLocalAssigneeId(person.id);

    const line = systemLine(
      isReassign
        ? `Task reassigned to ${person.displayName}`
        : `Task assigned to ${person.displayName}`
    );

    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);

    setAssignmentModalOpen(false);
  }

  /* ================= Execution authority ================= */

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

  /* ================= Notes ================= */

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

  /* ================= Summary association (UNCHANGED) ================= */

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

  /* ================= Archive ================= */

  const [confirmArchive, setConfirmArchive] = useState(false);

  /* ================= Render ================= */

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

        {/* ================= Footer ================= */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Governance row — UI ONLY (UNWIRED) */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button>CC</button>
            <button>Risk</button>
            <button>Issue</button>
            <button>QC</button>
            <span style={{ opacity: 0.6 }}>|</span>
            <button>Escalate</button>
          </div>

          {/* Operational row — unchanged behaviour */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>
              {!isCompleted && (
                <button onClick={() => setAssignmentModalOpen(true)}>
                  {localAssigneeId ? "Reassign" : "Assign"}
                </button>
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
              {showSubmit && <button onClick={handleSubmitWork}>Submit</button>}
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
