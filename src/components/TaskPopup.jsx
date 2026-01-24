// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 197 — Baseline-Anchored + Local Assignee Mirror
---------------------------------------------------------------------
ANCHOR:
• Behaviour consistent with pre-Stage-197 baselines
• Task remains single source of truth

STAGE 197 FIX:
• Submit / Complete ledger entries appended BEFORE lifecycle mutation

UX SYNC ENHANCEMENT:
• Local assignee mirror for immediate header + button update
• Display-only, clears naturally on parent rehydrate
• No authority or ledger ownership introduced
=====================================================================
*/

import { useEffect, useRef, useState } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import { localAssignees } from "../data/localAssignees";

/* ------------------------------------------------------------------
   Time + System Line Helpers
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

  const textareaRef = useRef(null);

  /* --------------------------------------------------------------
     Notes Ledger (unchanged)
  -------------------------------------------------------------- */

  const [ledgerText, setLedgerText] = useState(
    Array.isArray(task.notes) ? task.notes.join("\n") : ""
  );

  const [draftText, setDraftText] = useState("");

  function appendAndPersist(line) {
    setLedgerText((prev) => {
      const base = typeof prev === "string" ? prev.trim() : "";
      const next = base ? `${base}\n${line}` : line;
      onAddNote(task.id, line);
      return next;
    });
  }

  /* --------------------------------------------------------------
     Assignment (with local mirror)
  -------------------------------------------------------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  // 🔹 Local display-only mirror
  const [localAssigneeOverride, setLocalAssigneeOverride] = useState(null);

  // Clear override once parent reflects assignment
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

    // Parent mutation (authoritative)
    onAssignTask(task.id, selectedAssigneeId);

    // Local mirror for immediate UI reflection
    setLocalAssigneeOverride({
      id: selectedAssigneeId,
      label: assignee?.displayName || selectedAssigneeId,
    });

    setAssigning(false);
    setSelectedAssigneeId("");
  }

  /* --------------------------------------------------------------
     Execution State (derived from effective assignee)
  -------------------------------------------------------------- */

  const executionState = normaliseExecutionState(
    (task.executionState || "NOT_STARTED").replace(" ", "_")
  );

  const isAssigned = Boolean(effectiveAssigneeId);
  const isAssignee = effectiveAssigneeId === "current-user";
  const isPM = currentUserRole === "PM";
  const isPMProxy = isPM && isAssigned && !isAssignee;

  const showStart =
    executionState === "NOT_STARTED" && (isAssignee || isPMProxy);

  const showSubmitted =
    executionState === "STARTED" && (isAssignee || isPMProxy);

  const showCompleted =
    executionState === "SUBMITTED" && isPM;

  /* --------------------------------------------------------------
     Lifecycle Handlers (Stage 197 ordering preserved)
  -------------------------------------------------------------- */

  function handleStartWork() {
    if (!showStart) return;

    appendAndPersist(
      systemLine(
        isPMProxy ? "Work started by PM (proxy)" : "Work started"
      )
    );

    onStartExecution(task.id);
  }

  function handleSubmitted() {
    if (!showSubmitted) return;

    appendAndPersist(
      systemLine(
        isPMProxy ? "Work submitted by PM (proxy)" : "Work submitted"
      )
    );

    onSubmitExecution(task.id);
  }

  function handleCompleted() {
    if (!showCompleted) return;

    appendAndPersist(systemLine("Task completed by PM"));
    onCompleteExecution(task.id);
  }

  /* --------------------------------------------------------------
     Close Handling
  -------------------------------------------------------------- */

  function handleClose() {
    if (draftText.trim()) {
      appendAndPersist(draftText.trim());
    }
    onClose();
  }

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

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
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >
        <CanonicalTaskPopupHeader task={headerTask} onClose={handleClose} />

        <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: "8px" }}>
            <textarea
              ref={textareaRef}
              value={ledgerText + (draftText ? "\n" + draftText : "")}
              onChange={(e) =>
                setDraftText(
                  e.target.value.replace(ledgerText, "").trimStart()
                )
              }
              style={{
                width: "100%",
                height: "100%",
                resize: "none",
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {assigning && (
              <>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
                >
                  <option value="">— Select —</option>
                  {localAssignees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.displayName}
                    </option>
                  ))}
                </select>
                <button onClick={handleConfirmAssignment}>
                  Confirm assignment
                </button>
              </>
            )}

            {!assigning && (
              <button onClick={() => setAssigning(true)}>Assign task</button>
            )}

            {showStart && <button onClick={handleStartWork}>Start work</button>}
            {showSubmitted && <button onClick={handleSubmitted}>Submit</button>}
            {showCompleted && <button onClick={handleCompleted}>Complete</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
