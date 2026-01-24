// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 200 — Canonical Notes Commit Implementation (FINAL)
---------------------------------------------------------------------
SEM BASIS:
• SEM-NOTES-01 — Ledger vs Draft Boundary
• SEM-NR-01    — Behavioural Continuity

CANON (STAGE 200):
• Ledger authority remains with parent
• Draft is a single editable surface
• Commit is explicit (button only)
• Close is inert (no commit)
• UI is synchronised immediately for visibility only
=====================================================================
*/

import { useEffect, useRef, useState } from "react";
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
     Notes
  -------------------------------------------------------------- */

  const [draftText, setDraftText] = useState("");

  function commitDraft() {
    const text = draftText.trim();
    if (!text) return;
    onAddNote(task.id, text);
    setDisplayNotes((prev) => [...prev, text]);
    setDraftText("");
  }

  function handleClose() {
    setDraftText("");
    onClose();
  }

  /* --------------------------------------------------------------
     Assignment
  -------------------------------------------------------------- */

  const [assigning, setAssigning] = useState(false);
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

  function handleConfirmAssignment() {
    if (!selectedAssigneeId) return;

    const assignee = localAssignees.find(
      (a) => a.id === selectedAssigneeId
    );

    onAssignTask(task.id, selectedAssigneeId);

    setLocalAssigneeOverride({
      id: selectedAssigneeId,
      label: assignee?.displayName || selectedAssigneeId,
    });

    setAssigning(false);
    setSelectedAssigneeId("");
  }

  /* --------------------------------------------------------------
     Execution State
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
          width: "700px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <CanonicalTaskPopupHeader task={headerTask} onClose={handleClose} />

        <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          {displayNotes.length > 0 && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#f5f5f5",
                padding: "8px",
                marginBottom: "12px",
              }}
            >
              {displayNotes.join("\n")}
            </pre>
          )}

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Add a note…"
            style={{ width: "100%", minHeight: "80px" }}
          />

          <div style={{ marginTop: "8px" }}>
            <button onClick={commitDraft}>Commit notes</button>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #ddd",
            padding: "12px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {!isAssigned && isPM && !assigning && (
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
              <button onClick={handleConfirmAssignment}>Confirm</button>
            </>
          )}

          {showStart && <button onClick={handleStartWork}>Start</button>}
          {showSubmitted && (
            <button onClick={handleSubmitted}>Submit</button>
          )}
          {showCompleted && (
            <button onClick={handleCompleted}>Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}
