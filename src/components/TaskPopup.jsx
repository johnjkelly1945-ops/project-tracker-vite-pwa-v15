import { corporateTemplates } from "../data/corporateTemplates";
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
Stage 325 — SEM-TS Identity Row Realisation (UI ONLY)
Stage 325B — Inline Commit Surface Realisation (UI ONLY)
---------------------------------------------------------------------
• Notes modal removed
• Embedded commit surface (borderless, transaction-surface)
• Footer preserved verbatim (no drift)
• Append-only preserved
• No lifecycle mutation changes
• No governance logic changes
=====================================================================
*/

import { useState, useEffect, useMemo, useRef } from "react";
import { attemptAction } from "../domain/authority/ActionExecutor.js";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import TaskDescriptionModal from "./TaskDescriptionModal";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import { personnel } from "../data/personnel";
import ReviewModal from "./ReviewModal";
import RiskModal from "./RiskModal";
import RiskRegisterModal from "./RiskRegisterModal";
import IssueRegisterModal from "./IssueRegisterModal";
import QCRegisterModal from "./QCRegisterModal";
import CCRegisterModal from "./CCRegisterModal";
import IssueModal from "./IssueModal";
import QCModal from "./QCModal";
import CCModal from "./CCModal";
import EscalationRegisterModal from "./EscalationRegisterModal";
import {
  bridgeTriggerGovernanceEvent,
  bridgeEscalateGovernanceEvent,
} from "../governance/governanceBridge";
import { getGovernanceEventsByTask } from "../governance/governanceStore";
import { getActingUser } from "../domain/actor/ActingUser";

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
  onAddDescription,
  onAssignTask,
  onStartExecution,
  onSubmitExecution,
  onCompleteExecution,
  onChangeTaskSummary,
  onArchiveTask,
  hasMutationAuthority,
  workspaceMode,
  onArchiveSegment,
  currentUserRole = "PM",
  readOnly = false,
}) {
  if (!task) return null;

  const isReadOnly = readOnly === true;

  /* ================= Stage 429 — Navigation Handler (Routing) ================= */
  function handleNavigateToEscalationSource(e) {
    const personId = getPersonId(getCurrentUserFromStorage());
    const actor = personId
      ? getPersonnel().find(p => p.id === personId)
      : null;

    if (!actor) return;

    switch (e.sourceType) {
      case "RISK":
        setActiveRiskEventId(e.sourceId);
        setRiskModalOpen(true);
        break;

      case "ISSUE":
        setActiveIssueEventId(e.sourceId);
        setIssueModalOpen(true);
        break;

      case "QC":
        setActiveQcEventId(e.sourceId);
        setQcModalOpen(true);
        break;

      case "CC":
        setActiveCcEventId(e.sourceId);
        setCcModalOpen(true);
        break;

      default:
        return;
    }
  }
  /* ================= End Stage 429 ================= */
  const [displayNotes, setDisplayNotes] = useState(task.notes || []);

  const [localAssigneeId, setLocalAssigneeId] = useState(task.assigneeId || "");
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [segmentArchiveConfirmOpen, setSegmentArchiveConfirmOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeReviewEventId, setActiveReviewEventId] = useState(null);

  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [riskRegisterOpen, setRiskRegisterOpen] = useState(false);
  const [activeRiskEventId, setActiveRiskEventId] = useState(null);

  /* ================= Stage 333 — Issue State ================= */
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueRegisterOpen, setIssueRegisterOpen] = useState(false);
  const [activeIssueEventId, setActiveIssueEventId] = useState(null);
  /* ================= End Stage 333 State ================= */

  /* ================= Stage 334 — QC State ================= */
  const [qcModalOpen, setQcModalOpen] = useState(false);
  const [qcRegisterOpen, setQcRegisterOpen] = useState(false);
  const [ccRegisterOpen, setCcRegisterOpen] = useState(false);
  const [activeQcEventId, setActiveQcEventId] = useState(null);
  /* ================= End Stage 334 State ================= */

  /* ================= Stage 335 — CC State ================= */
  const [ccModalOpen, setCcModalOpen] = useState(false);
  const [escalationRegisterOpen, setEscalationRegisterOpen] = useState(false);
  const [activeCcEventId, setActiveCcEventId] = useState(null);
  /* ================= Stage 341 — Description State ================= */
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  /* ================= End Stage 341 State ================= */
  /* ================= End Stage 335 State ================= */



  const [inlineDraftText, setInlineDraftText] = useState("");
  const inlineRef = useRef(null);

  const [linkDocOpen, setLinkDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docRef, setDocRef] = useState("");

  /* ================= Stage 351 — Available taskDescription templates (optional) ================= */
  const availableTemplates = useMemo(() => {
    return (corporateTemplates || []).filter(t =>
      t && t.status === "active" && t.templateType === "taskDescription"
    );
  }, []);


  const currentSummaryId = task.summaryId || "";
  const [summaryEditing, setSummaryEditing] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] = useState(currentSummaryId);

  /* =====================================================
     STAGE 427 — ESCALATION CONTEXT CARRIER (PHASE 1A)
     Additive only — no behaviour change
     ===================================================== */
  const [escalationContext, setEscalationContext] = useState(null);


  useEffect(() => {
    setDisplayNotes(task.notes || []);
    setLocalAssigneeId(task.assigneeId || "");
  }, [task]);

  /* ================= Identity Resolution (SEM-TS) ================= */

  const executionState = task.executionState || "NOT_STARTED";
  const summary = summaries.find((s) => s.id === task.summaryId);
  const summaryTitle = summary ? summary.title : null;

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

  const isCompleted = executionState === "COMPLETED";

  const isAssigned = Boolean(localAssigneeId);
  const isArchived = task.taskState === "archived";
  const isAssignee = localAssigneeId === "current-user";
  const isPM = currentUserRole === "PM";
  const isPMProxy = isPM && isAssigned && !isAssignee;

  // STAGE 420 — SURFACE SELECTION (CANONICAL)

  const isOperational = isPM || isAssignee;

  if (!isOperational) {
    return (
      <div style={{ padding: "20px" }}>
        Advisory View (placeholder)
      </div>
    );
  }


  const showStart = executionState === "NOT_STARTED" && (isAssignee || isPMProxy);
  const showSubmit = executionState === "IN_PROGRESS" && (isAssignee || isPMProxy);
  const showComplete = executionState === "SUBMITTED" && isPM;

  function handleStartWork() {
    if (!showStart) return;
    const line = systemLine(isPMProxy ? "Work started by PM (proxy)" : "Work started");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);
    onStartExecution(task.id);
  }

  function handleSubmitWork() {
    if (!showSubmit) return;
    const line = systemLine(isPMProxy ? "Work submitted by PM (proxy)" : "Work submitted");
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

  /* ================= Review Activation ================= */

  function handleInitiateReview() {
    if (!(executionState === "SUBMITTED" && isPM)) return;

    const existing = getGovernanceEventsByTask(task.id).find(
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


  /* ================= Risk Activation ================= */

  function handleInitiateRisk() {
    if (!isPM) return;
    setRiskRegisterOpen(true);
  }


  /* ================= Issue Activation ================= */


  /* ================= Issue Activation ================= */

  function handleInitiateIssue() {
    if (!isPM) return;
    setIssueRegisterOpen(true);
  }
  function handleEscalateIssue() {
    if (!activeIssueEventId) return;

    const line = systemLine("Issue escalated by PM");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    setEscalationContext({
      sourceType: "ISSUE",
      sourceId: activeIssueEventId
    });

    bridgeEscalateGovernanceEvent({ eventId: activeIssueEventId });

    setEscalationRegisterOpen(true);
  }
  /* ================= QC Activation ================= */

  function handleEscalateRisk() {
    if (!activeRiskEventId) return;

    const line = systemLine("Risk escalated by PM");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    bridgeEscalateGovernanceEvent({ eventId: activeRiskEventId });
  }

  function handleEscalateQC() {
    if (!activeQcEventId) return;

    const line = systemLine("QC escalated by PM");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    setEscalationContext({
      sourceType: "QC",
      sourceId: activeQcEventId
    });

    bridgeEscalateGovernanceEvent({ eventId: activeQcEventId });

    setEscalationRegisterOpen(true);
  }
  function handleEscalateCC() {
    if (!activeCcEventId) return;

    const line = systemLine("CC escalated by PM");
    onAddNote(task.id, line);
    setDisplayNotes((p) => [...p, line]);

    setEscalationContext({
      sourceType: "CC",
      sourceId: activeCcEventId
    });

    bridgeEscalateGovernanceEvent({ eventId: activeCcEventId });

    setEscalationRegisterOpen(true);
  }
  function handleInitiateQC() {
    if (!isPM) return;
    setQcRegisterOpen(true);
  }


  /* ================= CC Activation ================= */

  function handleInitiateCC() {
    if (!isPM) return;

    const existing = getGovernanceEventsByTask(task.id).find(
      (e) => e.eventType === "cc" && e.status === "OPEN"
    );

    let event;

    if (existing) {
      event = existing;
    } else {
      event = bridgeTriggerGovernanceEvent({
        eventType: "cc",
        taskId: task.id,
        initiatedBy: "PM",
      });

      const line = systemLine("CC initiated by PM");
      onAddNote(task.id, line);
      setDisplayNotes((p) => [...p, line]);
    }

    setActiveCcEventId(event.eventId);
    setCcModalOpen(true);
  }

  /* ================= Inline Commit ================= */

  function handleCommitInlineNote() {
    if (isArchived) return;
    const text = inlineDraftText.trim();
    if (!text) return;

    const actor = `[${currentUserRole}]`;
    const stamped = `${actor} ${text} — ${nowStamp()}`;
    const actorObj = getActingUser();

    const target = {
      id: task.id,
      surface: "TASK",
      segmentId: task.segmentId
    };

    const context = {
      segmentId: task.segmentId
    };

    const success = attemptAction({
      actor: actorObj,
      action: "ADD_TASK_NOTE",
      target,
      context,
      execute: () => onAddNote(task.id, stamped)
    });

    if (!success) return;

    setDisplayNotes((p) => [...p, stamped]);
    setInlineDraftText("");

    // keep the surface ready for the next entry
    if (inlineRef.current) inlineRef.current.focus();
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

  function confirmSegmentArchive() {
    if (!onArchiveSegment) return;
    onArchiveSegment(task.segmentId);
    setSegmentArchiveConfirmOpen(false);
    onClose();
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
        <CanonicalTaskPopupHeader
          task={task}
          summaryTitle={summaryTitle}
          executionState={executionState}
          onClose={onClose}
          onTitleClick={() => setDescriptionOpen(true)}
        />

        {descriptionOpen && (
          <TaskDescriptionModal
            taskId={task.id}
          taskTitle={task.title}
    
            entries={task.descriptionEntries || []}
            onAddDescription={onAddDescription}
            onClose={() => setDescriptionOpen(false)}
            currentUserRole={currentUserRole}
            availableTemplates={availableTemplates}
          />
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <strong>Notes</strong>

          <div style={{ marginTop: "12px" }}>
            {displayNotes.map((line, idx) => {
              const [text, ts] = line.split(" — ");
              return (
                <div key={idx} style={{ marginBottom: "16px" }}>
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

          {/* Embedded transaction input (borderless, not a boxed container) */}
          <div
            style={{
              marginTop: "16px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: "12px",
            }}
          >
            <textarea
              ref={inlineRef}
              rows={3}
              style={{
                width: "100%",
                resize: "vertical",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
              placeholder="Enter note..."
              value={inlineDraftText}
              onChange={(e) => setInlineDraftText(e.target.value)}
            />

            <div style={{ textAlign: "right", marginTop: "6px" }}>
              <button onClick={handleCommitInlineNote}>Commit note</button>
            </div>
          </div>
        </div>

        {/* Footer preserved verbatim (baseline grammar) */}
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
            <span style={{ cursor: isPM ? "pointer" : "default", opacity: isPM ? 1 : 0.5 }} onClick={isPM ? () => setCcRegisterOpen(true) : undefined}>CC</span> · <span style={{ cursor: isPM ? "pointer" : "default", opacity: isPM ? 1 : 0.5 }} onClick={isPM ? handleInitiateRisk : undefined}>Risk</span> · <span style={{ cursor: isPM ? "pointer" : "default", opacity: isPM ? 1 : 0.5 }} onClick={isPM ? handleInitiateIssue : undefined}>Issue</span> · <span style={{ cursor: isPM ? "pointer" : "default", opacity: isPM ? 1 : 0.5 }} onClick={isPM ? handleInitiateQC : undefined}>QC</span>
            {executionState === "SUBMITTED" && isPM && (
              <> · <span style={{ cursor: "pointer" }} onClick={handleInitiateReview}>Review</span></>
            )}
            {" | "}
            <span style={{ cursor: "pointer" }} onClick={() => {
                setEscalationContext(null);
                setEscalationRegisterOpen(true);
              }}>Escalate</span>
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
              <button onClick={() => setLinkDocOpen(true)}>Link document</button>
            </div>

            <div style={{ minWidth: "140px", textAlign: "right" }}>
              {showStart && <button onClick={handleStartWork}>Start</button>}
              {showSubmit && <button onClick={handleSubmitWork}>Submit</button>}
              {showComplete && (
                <button onClick={handleCompleteWork}>Complete</button>
              )}
              {task.systemAction === "ARCHIVE_SEGMENT" &&
               hasMutationAuthority &&
               workspaceMode === "single" && (
                 <button
                   style={{ marginRight: "8px" }}
                   onClick={() => setSegmentArchiveConfirmOpen(true)}
                 >
                   Archive Segment
                 </button>
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


      {archiveConfirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
          }}
        >
          <div style={{ background: "#fff", padding: "20px" }}>
            <button onClick={confirmArchive}>Confirm</button>
            <button onClick={() => setArchiveConfirmOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {segmentArchiveConfirmOpen && (
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
            <strong>Archive this segment?</strong>
            <p style={{ marginTop: "10px" }}>
              This will move the segment to the sidebar and remove it from active view.
            </p>
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button onClick={confirmSegmentArchive}>Confirm</button>
              <button onClick={() => setSegmentArchiveConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {reviewModalOpen && (
        <ReviewModal
          onAddNote={onAddNote}
          taskId={task.id}
          eventId={activeReviewEventId}
          taskTitle={task.title}
          onClose={() => setReviewModalOpen(false)}
        />
      )}


      {riskRegisterOpen && (
        <RiskRegisterModal
          taskId={task.id}
          onClose={() => setRiskRegisterOpen(false)}
          openRiskEvent={(eventId) => {
            setActiveRiskEventId(eventId);
            setRiskRegisterOpen(false);
            setRiskModalOpen(true);
          }}
        />
      )}
      {issueRegisterOpen && (
        <IssueRegisterModal
          taskId={task.id}
          onClose={() => setIssueRegisterOpen(false)}
          openIssueEvent={(eventId) => {
            setActiveIssueEventId(eventId);
            setIssueRegisterOpen(false);
            setIssueModalOpen(true);
          }}        />
      )}

        {qcRegisterOpen && (
          <QCRegisterModal
            taskId={task.id}
            onClose={() => setQcRegisterOpen(false)}
            openQCEvent={(eventId) => {
              setActiveQcEventId(eventId);
              setQcRegisterOpen(false);
              setQcModalOpen(true);
            }}
          />
        )}

        {ccRegisterOpen && (
          <CCRegisterModal
            taskId={task.id}
            onClose={() => setCcRegisterOpen(false)}
            openCCEvent={(id) => {
              setActiveCcEventId(id);
              setCcModalOpen(true);
            }}
          />
        )}

        {riskModalOpen && (
          <RiskModal
            taskTitle={task.title}
            taskId={task.id}
            eventId={activeRiskEventId}
            onClose={() => setRiskModalOpen(false)}
            onAddNote={onAddNote}
            onEscalate={() => {
              setEscalationContext({
                sourceType: "RISK",
                sourceId: activeRiskEventId
              });
              setEscalationRegisterOpen(true);
            }}
          />
        )}

      {issueModalOpen && activeIssueEventId && (
        <IssueModal
          taskId={task.id}
          eventId={activeIssueEventId}
          taskTitle={task.title}
          onClose={() => setIssueModalOpen(false)}
          onAddNote={onAddNote}
          onEscalate={handleEscalateIssue}
        />
      )}

      {qcModalOpen && activeQcEventId && (
        <QCModal
          taskId={task.id}
          taskTitle={task.title}
          eventId={activeQcEventId}
          onClose={() => setQcModalOpen(false)}
          onAddNote={onAddNote}
          onEscalate={handleEscalateQC}
        />
      )}


      {ccModalOpen && activeCcEventId && (
        <CCModal
          taskId={task.id}
          taskTitle={task.title}
          eventId={activeCcEventId}
          onClose={() => setCcModalOpen(false)}
          onAddNote={onAddNote}
          onEscalate={handleEscalateCC}
        />
      )}

      {escalationRegisterOpen && (
        <EscalationRegisterModal
          taskId={task.id}
          taskTitle={task.title}
          sourceType={(escalationContext && escalationContext.sourceType) || "TASK"}
          sourceId={(escalationContext && escalationContext.sourceId) || task.id}
          onClose={() => setEscalationRegisterOpen(false)}
          onAddNote={onAddNote}
          onNavigate={handleNavigateToEscalationSource}
        />
      )}
    </div>
  );
}

