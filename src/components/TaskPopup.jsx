// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 239 — Task → Summary Association (Canonical Closure Fix)
Stage 246 — Assignment Selection Modal (UI Only)
Stage 249 — Governance Controls Restoration (UI Only)
Stage 257 — Personnel Assignment Wiring
Stage 257-B — Footer & Notes Visual Clarification (UI ONLY)
Stage 257-C — Assign/Reassign Label + Timestamp Presentation (UI ONLY)
Stage 260 — Archive Confirmation Gate (Mechanical Only)
Stage 268 — Document Link as Immutable Task Event (CANONICAL)
Stage 270 — Template Link as Immutable Task Event (CANONICAL)
Stage 319 — Review Governance Activation (Controlled)
Stage 323 — Review Initiation Reuse Policy (Canonical Fix)
Stage 324A — Governance Line Canonicalisation (UI ONLY)
---------------------------------------------------------------------
• Footer controls preserved verbatim except Review relocation
• Review moved to governance line
• No lifecycle mutation
• No behaviour change
• UI only
=====================================================================
*/

import { useState, useEffect } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import { personnel } from "../data/personnel";
import ReviewModal from "./ReviewModal";
import { bridgeTriggerGovernanceEvent } from "../governance/governanceBridge";
import { getGovernanceEventsByTask } from "../governance/governanceStore";

/* ===================== Time helpers ===================== */

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

/* ===================== Component ===================== */

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
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [modalDraftText, setModalDraftText] = useState("");
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeReviewEventId, setActiveReviewEventId] = useState(null);

  const [linkDocOpen, setLinkDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docRef, setDocRef] = useState("");

  const [linkTemplateOpen, setLinkTemplateOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateRef, setTemplateRef] = useState("");

  const currentSummaryId = task.summaryId || "";
  const [summaryEditing, setSummaryEditing] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] =
    useState(currentSummaryId);

  useEffect(() => {
    setDisplayNotes(task.notes || []);
    setLocalAssigneeId(task.assigneeId || "");
  }, [task]);

  /* ================= Assignment ================= */

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
    setDisplayNotes((p) => [...p, line]);
    setAssignmentModalOpen(false);
  }

  /* ================= Execution ================= */

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
  const showComplete =
    executionState === "SUBMITTED" && isPM;

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

  /* ================= Review Activation (Corrected) ================= */

  function handleInitiateReview() {
    if (!(executionState === "SUBMITTED" && isPM)) return;

    const existing = getGovernanceEventsByTask(task.id)
      .find(
        (e) => e.eventType === "review" && e.status === "OPEN"
      );

    let event;

    if (existing) {
      event = existing;
    } else {
      event = bridgeTriggerGovernanceEvent({
        eventType: "review",
        taskId: task.id,
        initiatedBy: "PM",
      });

      const line = systemLine("Review initiated by PM");
      onAddNote(task.id, line);
      setDisplayNotes((p) => [...p, line]);
    }

    setActiveReviewEventId(event.eventId);
    setReviewModalOpen(true);
  }

  function commitNoteDraft() {
    const text = modalDraftText.trim();
    if (!text) return;
    const stamped = `${text} — ${nowStamp()}`;
    onAddNote(task.id, stamped);
    setDisplayNotes((p) => [...p, stamped]);
    setNoteModalOpen(false);
  }

  function confirmSummaryEdit() {
    if (selectedSummaryId !== currentSummaryId) {
      onChangeTaskSummary(task.id, selectedSummaryId || null);
      const line = systemLine("Summary association updated");
      onAddNote(task.id, line);
    }
    onClose();
  }

  function confirmArchive() {
    onArchiveTask(task.id);
    setArchiveConfirmOpen(false);
  }

  function confirmLinkDocument() {
    const title = docTitle.trim();
    const ref = docRef.trim();
    if (!title || !ref) return;

    const line = systemLine(`Document linked: "${title}"\n${ref}`);
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    setDocTitle("");
    setDocRef("");
    setLinkDocOpen(false);
  }

  function confirmLinkTemplate() {
    const title = templateTitle.trim();
    const ref = templateRef.trim();
    if (!title || !ref) return;

    const line = systemLine(`Template linked: "${title}"\n${ref}`);
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    setTemplateTitle("");
    setTemplateRef("");
    setLinkTemplateOpen(false);
  }

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
          {displayNotes.map((line, idx) => {
            const [text, ts] = line.split(" — ");
            return (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>
                {ts && (
                  <span style={{ marginLeft: "6px", fontSize: "12px", color: "#777" }}>
                    — {ts}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(11,58,102,0.25)",
            background: "rgba(11,58,102,0.10)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ textAlign: "center", fontStyle: "italic", color: "#333" }}>
            <span>CC</span> · <span>Risk</span> · <span>Issue</span> · <span>QC</span>
            {executionState === "SUBMITTED" && isPM && (
              <> · <span style={{ cursor: "pointer" }} onClick={handleInitiateReview}>Review</span></>
            )}
            {" | "}
            <span>Escalate</span>
          </div>

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
                <button onClick={() => setSummaryEditing(true)}>
                  Link summary
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
                </>
              )}
              <button onClick={() => setNoteModalOpen(true)}>Add note</button>
              <button onClick={() => setLinkDocOpen(true)}>Link document</button>
              <button onClick={() => setLinkTemplateOpen(true)}>Link template</button>
            </div>

            <div style={{ minWidth: "140px", textAlign: "right" }}>
              {showStart && <button onClick={handleStartWork}>Start</button>}
              {showSubmit && <button onClick={handleSubmitWork}>Submit</button>}
              {showComplete && (
                <button onClick={handleCompleteWork}>Complete</button>
              )}
              <button onClick={() => setArchiveConfirmOpen(true)}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {assignmentModalOpen && (
        <SubordinateSelectionModal
          title={localAssigneeId ? "Reassign Task" : "Assign Task"}
          items={personnel}
          onSelect={handleSelectAssignee}
          onClose={() => setAssignmentModalOpen(false)}
        />
      )}

      {noteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div style={{ background: "#fff", padding: "20px", width: "400px" }}>
            <textarea
              rows={5}
              style={{ width: "100%" }}
              value={modalDraftText}
              onChange={(e) => setModalDraftText(e.target.value)}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={commitNoteDraft}>Add</button>
              <button onClick={() => setNoteModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {linkDocOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2500,
          }}
        >
          <div style={{ background: "#fff", padding: "20px", width: "420px" }}>
            <strong>Link document</strong>
            <div style={{ marginTop: "10px" }}>
              <input
                style={{ width: "100%", marginBottom: "8px" }}
                placeholder="Document title"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
              />
              <input
                style={{ width: "100%" }}
                placeholder="Document reference (URL / identifier)"
                value={docRef}
                onChange={(e) => setDocRef(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button onClick={confirmLinkDocument}>Confirm</button>
              <button onClick={() => setLinkDocOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {linkTemplateOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2600,
          }}
        >
          <div style={{ background: "#fff", padding: "20px", width: "420px" }}>
            <strong>Link template</strong>
            <div style={{ marginTop: "10px" }}>
              <input
                style={{ width: "100%", marginBottom: "8px" }}
                placeholder="Template title"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
              />
              <input
                style={{ width: "100%" }}
                placeholder="Template reference (URL / identifier)"
                value={templateRef}
                onChange={(e) => setTemplateRef(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button onClick={confirmLinkTemplate}>Confirm</button>
              <button onClick={() => setLinkTemplateOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {reviewModalOpen && (
        <ReviewModal
          onAddNote={onAddNote}
          taskId={task.id}
          eventId={activeReviewEventId}
          onClose={() => setReviewModalOpen(false)}
        />
      )}
    </div>
  );
}
