// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 224 — Notes Interaction Model Revision
---------------------------------------------------------------------
• Draft notes isolated to modal surface
• Explicit add / commit / cancel semantics
• Commit available via footer OR modal (proxy delivery)
• Canonical notes remain append-only
• No scroll, footer, or persistence changes
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
  currentUserRole = "PM",
}) {
  if (!task) return null;

  /* ---------------- Local mirrors ---------------- */

  const [displayNotes, setDisplayNotes] = useState(task.notes || []);
  const [localExecutionState, setLocalExecutionState] = useState(
    (task.executionState || "NOT_STARTED").replace(" ", "_")
  );
  const [localAssigneeId, setLocalAssigneeId] = useState(task.assigneeId || "");

  useEffect(() => {
    setDisplayNotes(task.notes || []);
  }, [task.notes]);

  /* ---------------- Assignment ---------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  function confirmAssignment() {
    if (!selectedAssigneeId) return;

    const assignee = localAssignees.find(
      (a) => a.id === selectedAssigneeId
    );

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

  function cancelAssignment() {
    setAssigning(false);
    setSelectedAssigneeId("");
  }

  /* ---------------- Execution authority ---------------- */

  const isAssigned = Boolean(localAssigneeId);
  const isAssignee = localAssigneeId === "current-user";
  const isPM = currentUserRole === "PM";
  const isPMProxy = isPM && isAssigned && !isAssignee;

  const showStart =
    localExecutionState === "NOT_STARTED" &&
    (isAssignee || isPMProxy);

  const showSubmit =
    localExecutionState === "STARTED" &&
    (isAssignee || isPMProxy);

  const showComplete =
    localExecutionState === "SUBMITTED" && isPM;

  function handleStartWork() {
    if (!showStart) return;
    const line = systemLine(
      isPMProxy ? "Work started by PM (proxy)" : "Work started"
    );
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setLocalExecutionState("STARTED");
    onStartExecution(task.id);
  }

  function handleSubmitWork() {
    if (!showSubmit) return;
    const line = systemLine(
      isPMProxy ? "Work submitted by PM (proxy)" : "Work submitted"
    );
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setLocalExecutionState("SUBMITTED");
    onSubmitExecution(task.id);
  }

  function handleCompleteWork() {
    if (!showComplete) return;
    const line = systemLine("Task completed by PM");
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setLocalExecutionState("COMPLETED");
    onCompleteExecution(task.id);
  }

  /* ---------------- Notes (Stage 224) ---------------- */

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
    setDisplayNotes((prev) => [...prev, stamped]);
    setModalDraftText("");
    setNoteModalOpen(false);
  }

  /* ---------------- Summary ---------------- */

  const currentSummaryId = task.summaryId || "";
  const [summaryEditing, setSummaryEditing] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] = useState(
    currentSummaryId
  );

  function confirmSummaryAssociation() {
    if (selectedSummaryId !== currentSummaryId) {
      onChangeTaskSummary(task.id, selectedSummaryId || null);
      const line = systemLine("Summary association updated");
      onAddNote(task.id, line);
      setDisplayNotes((prev) => [...prev, line]);
    }
    setSummaryEditing(false);
  }

  function cancelSummaryAssociation() {
    setSelectedSummaryId(currentSummaryId);
    setSummaryEditing(false);
  }

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
          maxWidth: "90%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >
        <CanonicalTaskPopupHeader
          task={{
            ...task,
            assigneeId: localAssigneeId,
            executionState: localExecutionState,
          }}
          onClose={onClose}
        />

        {/* ---------------- Notes viewport (ONLY scroll region) ---------------- */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <strong>Summary</strong>
          <div style={{ marginBottom: "12px" }}>
            {!summaryEditing && (
              <>
                <div>
                  {summaries.find((s) => s.id === currentSummaryId)?.title ||
                    "Unassigned"}
                </div>
                <button onClick={() => setSummaryEditing(true)}>
                  Associate with summary
                </button>
              </>
            )}

            {summaryEditing && (
              <>
                <select
                  value={selectedSummaryId}
                  onChange={(e) => setSelectedSummaryId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {summaries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <button onClick={confirmSummaryAssociation}>Confirm</button>
                <button onClick={cancelSummaryAssociation}>Cancel</button>
              </>
            )}
          </div>

          {!isAssigned && !assigning && (
            <button onClick={() => setAssigning(true)}>Assign task</button>
          )}

          {assigning && (
            <>
              <select
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
              >
                <option value="">Select assignee…</option>
                {localAssignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName || a.id}
                  </option>
                ))}
              </select>
              <button onClick={confirmAssignment}>Confirm assignment</button>
              <button onClick={cancelAssignment}>Cancel</button>
            </>
          )}

          <strong>Notes</strong>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {displayNotes.map((line, idx) => {
              const splitIndex = line.lastIndexOf(" — ");
              if (splitIndex === -1) {
                return <div key={idx}>{line}</div>;
              }
              const main = line.slice(0, splitIndex);
              const ts = line.slice(splitIndex + 3);
              return (
                <div key={idx}>
                  <span>{main}</span>
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "0.85em",
                      color: "#888",
                    }}
                  >
                    — {ts}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- CANONICAL FOOTER ---------------- */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "14px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {showStart && <button onClick={handleStartWork}>Start</button>}
            {showSubmit && <button onClick={handleSubmitWork}>Submit</button>}
            {showComplete && <button onClick={handleCompleteWork}>Complete</button>}
          </div>

          <div>
            <button onClick={openNoteModal}>Add note</button>
            <button
              onClick={commitNoteDraft}
              disabled={!noteModalOpen || !modalDraftText.trim()}
            >
              Commit note
            </button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>

      {/* ---------------- NOTE DRAFT MODAL (Stage 224) ---------------- */}
      {noteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "60%",
              maxWidth: "700px",
              padding: "20px",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <strong>Add note (draft)</strong>
            <textarea
              value={modalDraftText}
              onChange={(e) => setModalDraftText(e.target.value)}
              placeholder="Draft note (not yet committed)"
              style={{ marginTop: "10px", minHeight: "120px" }}
            />
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button
                onClick={commitNoteDraft}
                disabled={!modalDraftText.trim()}
              >
                Commit note
              </button>
              <button onClick={cancelNoteDraft} style={{ marginLeft: "8px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
