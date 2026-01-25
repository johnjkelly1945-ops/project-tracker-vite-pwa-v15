// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 203 — TaskPopup Surface Separation (Corrective)
Stage 205 — Steps 1–3: Notes, Typography & Footer (Visual Only)
Stage 205 — Step 4A: Popup Spatial Containment & Hierarchy (Visual)
Stage 206 — Canonical Note Timestamp Normalisation (Behavioural)
---------------------------------------------------------------------
SEM BASIS:
• SEM-AUTH-PM-01 — PM Authority Dominance
• SEM-EX         — Execution Semantics
• SEM-NR-01      — Behavioural Continuity
=====================================================================
*/

import { useEffect, useState } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import { localAssignees } from "../data/localAssignees";

/* ------------------------------------------------------------------
   Helpers
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

function normaliseExecutionState(state) {
  if (state === "IN_PROGRESS") return "STARTED";
  return state;
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

export default function TaskPopup({
  task,
  onClose,
  onAddNote,
  onAssignTask,
  onStartExecution,
  onSubmitExecution,
  onCompleteExecution,
  currentUserRole = "PM",
}) {
  if (!task) return null;

  /* --------------------------------------------------------------
     Local display mirrors (non-authoritative)
  -------------------------------------------------------------- */

  const [displayNotes, setDisplayNotes] = useState(task.notes || []);
  const [displayExecutionState, setDisplayExecutionState] = useState(
    normaliseExecutionState(
      (task.executionState || "NOT_STARTED").replace(" ", "_")
    )
  );

  useEffect(() => {
    setDisplayNotes(task.notes || []);
  }, [task.notes]);

  useEffect(() => {
    setDisplayExecutionState(
      normaliseExecutionState(
        (task.executionState || "NOT_STARTED").replace(" ", "_")
      )
    );
  }, [task.executionState]);

  /* --------------------------------------------------------------
     Note composition modal
  -------------------------------------------------------------- */

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [draftText, setDraftText] = useState("");

  function commitNote() {
    const text = draftText.trim();
    if (!text) return;

    const stampedText = `${text} — ${nowStamp()}`;

    setDraftText("");
    setNoteModalOpen(false);

    onAddNote(task.id, stampedText);
    setDisplayNotes((prev) => [...prev, stampedText]);
  }

  function cancelNote() {
    setDraftText("");
    setNoteModalOpen(false);
  }

  function handleClose() {
    setDraftText("");
    setNoteModalOpen(false);
    onClose();
  }

  /* --------------------------------------------------------------
     Assignment / Reassignment (UNCHANGED)
  -------------------------------------------------------------- */

  const [assigning, setAssigning] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [localAssigneeOverride, setLocalAssigneeOverride] = useState(null);

  useEffect(() => {
    if (
      localAssigneeOverride &&
      task.assigneeId === localAssigneeOverride.id
    ) {
      setLocalAssigneeOverride(null);
    }
  }, [task.assigneeId, localAssigneeOverride]);

  const effectiveAssigneeId =
    localAssigneeOverride?.id ?? task.assigneeId ?? "";

  const effectiveAssigneeLabel =
    localAssigneeOverride?.label ??
    task.assigneeLabel ??
    task.assigneeId ??
    "";

  function confirmAssignment() {
    if (!selectedAssigneeId) return;

    const assignee = localAssignees.find(
      (a) => a.id === selectedAssigneeId
    );

    const isReassignment = Boolean(effectiveAssigneeId);

    onAssignTask(task.id, selectedAssigneeId);

    const line = systemLine(
      isReassignment
        ? `Task reassigned to ${assignee?.displayName || selectedAssigneeId} by PM`
        : `Task assigned to ${assignee?.displayName || selectedAssigneeId} by PM`
    );

    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);

    setLocalAssigneeOverride({
      id: selectedAssigneeId,
      label: assignee?.displayName || selectedAssigneeId,
    });

    setAssigning(false);
    setReassigning(false);
    setSelectedAssigneeId("");
  }

  function cancelAssignmentChange() {
    setAssigning(false);
    setReassigning(false);
    setSelectedAssigneeId("");
  }

  /* --------------------------------------------------------------
     Execution State (UNCHANGED)
  -------------------------------------------------------------- */

  const isAssigned = Boolean(effectiveAssigneeId);
  const isAssignee = effectiveAssigneeId === "current-user";
  const isPM = currentUserRole === "PM";
  const isPMProxy = isPM && isAssigned && !isAssignee;

  const showStart =
    displayExecutionState === "NOT_STARTED" &&
    (isAssignee || isPMProxy);

  const showSubmitted =
    displayExecutionState === "STARTED" &&
    (isAssignee || isPMProxy);

  const showCompleted =
    displayExecutionState === "SUBMITTED" && isPM;

  function handleStartWork() {
    if (!showStart) return;
    const line = systemLine(
      isPMProxy ? "Work started by PM (proxy)" : "Work started"
    );
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setDisplayExecutionState("STARTED");
    onStartExecution(task.id);
  }

  function handleSubmitted() {
    if (!showSubmitted) return;
    const line = systemLine(
      isPMProxy ? "Work submitted by PM (proxy)" : "Work submitted"
    );
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setDisplayExecutionState("SUBMITTED");
    onSubmitExecution(task.id);
  }

  function handleCompleted() {
    if (!showCompleted) return;
    const line = systemLine("Task completed by PM");
    onAddNote(task.id, line);
    setDisplayNotes((prev) => [...prev, line]);
    setDisplayExecutionState("COMPLETED");
    onCompleteExecution(task.id);
  }

  /* --------------------------------------------------------------
     Render
  -------------------------------------------------------------- */

  const headerTask = {
    ...task,
    assigneeId: effectiveAssigneeId,
    assigneeLabel: effectiveAssigneeLabel,
  };

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
          width: "90%",          // ~10% narrower than workspace
          maxWidth: "90%",
          height: "80vh",        // fixed, empirically validated height
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <CanonicalTaskPopupHeader task={headerTask} onClose={handleClose} />

        {/* Notes viewport — ONLY scrolling region */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
            background: "#fafafa",
          }}
        >
          {displayNotes.length > 0 && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "transparent",
                padding: "12px",
                margin: 0,
                lineHeight: "1.65",
                color: "#333",
                fontWeight: 400,
              }}
            >
              {displayNotes.join("\n")}
            </pre>
          )}
        </div>

        {/* Footer — fixed, non-scrolling */}
        <div
          style={{
            borderTop: "1px solid #eee",
            padding: "14px 12px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            background: "#fbfbfb",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {!isAssigned && isPM && !assigning && (
              <button style={{ opacity: 0.9 }} onClick={() => setAssigning(true)}>
                Assign
              </button>
            )}

            {isAssigned && isPM && !reassigning && (
              <button style={{ opacity: 0.9 }} onClick={() => setReassigning(true)}>
                Reassign
              </button>
            )}

            {(assigning || reassigning) && (
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
                <button style={{ opacity: 0.9 }} onClick={confirmAssignment}>
                  Confirm
                </button>
                <button style={{ opacity: 0.9 }} onClick={cancelAssignmentChange}>
                  Cancel
                </button>
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {showStart && (
              <button style={{ opacity: 0.9 }} onClick={handleStartWork}>
                Start
              </button>
            )}
            {showSubmitted && (
              <button style={{ opacity: 0.9 }} onClick={handleSubmitted}>
                Submit
              </button>
            )}
            {showCompleted && (
              <button style={{ opacity: 0.9 }} onClick={handleCompleted}>
                Complete
              </button>
            )}
            <button style={{ opacity: 0.9 }} onClick={() => setNoteModalOpen(true)}>
              Add note
            </button>
          </div>
        </div>
      </div>

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
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "500px",
              borderRadius: "6px",
              padding: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Add a note…"
              style={{ width: "100%", minHeight: "120px" }}
            />
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={cancelNote}>Cancel</button>
              <button onClick={commitNote}>Commit note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
