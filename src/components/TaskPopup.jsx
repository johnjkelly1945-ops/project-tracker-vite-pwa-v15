// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 212 — Notes Semantics & Visual Meaning
---------------------------------------------------------------------
Applied onto:
baseline-2026-01-26-stage211-taskpopup-behavioural-reinstatement

AUTHORISED CONCERNS (STAGE 212):
• Concern 1 — Visual & semantic distinction for system-authored
               execution notes (presentation only)
• Concern 2 — Visual acknowledgement of committed user notes
               (presentation only)

NON-CHANGES (EXPLICIT):
• NO behavioural change
• NO new automation
• NO authority expansion
• NO data model change
• Stage 211 behaviour remains frozen and authoritative
=====================================================================
*/

import { useState } from "react";
import CanonicalTaskPopupHeader from "./CanonicalTaskPopupHeader";
import { localAssignees } from "../data/localAssignees";

export default function TaskPopup({
  task,
  summaries = [],
  onClose,
  onAddNote,
  onAssignTask,
  onStartExecution,
  onChangeTaskSummary,
}) {
  if (!task) return null;

  /* ---------------- Local UI mirrors (Stage 211) ---------------- */

  const [localAssigneeId, setLocalAssigneeId] = useState(task.assigneeId);
  const [localExecutionState, setLocalExecutionState] = useState(
    task.executionState || "NOT_STARTED"
  );

  /* ---------------- Assignment ---------------- */

  const [assigning, setAssigning] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const isAssigned = Boolean(localAssigneeId);

  function handleConfirmAssignment() {
    if (!selectedAssigneeId) return;

    onAssignTask(task.id, selectedAssigneeId);

    // Immediate visual reflection (local mirror)
    setLocalAssigneeId(selectedAssigneeId);

    setSelectedAssigneeId("");
    setAssigning(false);
  }

  function handleCancelAssignment() {
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  /* ---------------- Execution start ---------------- */

  const executionState =
    (localExecutionState || "NOT_STARTED").replace(" ", "_");

  const isAssignee = localAssigneeId === "current-user";

  const canStartExecution =
    isAssigned &&
    isAssignee &&
    executionState === "NOT_STARTED";

  function handleStartWork() {
    if (!canStartExecution) return;

    // Stage 211 — authorised system-authored execution note
    onAddNote(task.id, "[System] Execution started");

    // Existing execution trigger
    onStartExecution(task.id);

    // Immediate visual reflection (local mirror)
    setLocalExecutionState("IN_PROGRESS");
  }

  /* ---------------- Notes ---------------- */

  const [draftText, setDraftText] = useState("");

  function commitDraft() {
    const text = draftText.trim();
    if (!text) return;
    onAddNote(task.id, text);
    setDraftText("");
  }

  function handleClose() {
    setDraftText("");
    onClose();
  }

  function isSystemNote(note) {
    return typeof note === "string" && note.startsWith("[System]");
  }

  /* ---------------- Render ---------------- */

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
          maxHeight: "80vh",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ---------------- Header ---------------- */}
        <div
          style={{
            padding: "14px 16px",
            background: "#fafafa",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <CanonicalTaskPopupHeader
            task={{
              ...task,
              assigneeId: localAssigneeId,
              executionState: localExecutionState,
            }}
          />
        </div>

        {/* ---------------- Body ---------------- */}
        <div
          style={{
            padding: "20px 16px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {!isAssigned && !assigning && (
            <button onClick={() => setAssigning(true)}>
              Assign task
            </button>
          )}

          {!isAssigned && assigning && (
            <div style={{ marginTop: "12px" }}>
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

              <div style={{ marginTop: "8px" }}>
                <button
                  disabled={!selectedAssigneeId}
                  onClick={handleConfirmAssignment}
                >
                  Confirm assignment
                </button>
                <button onClick={handleCancelAssignment}>
                  Cancel
                </button>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#555",
                }}
              >
                Assignment locks task identity and cannot be undone.
              </div>
            </div>
          )}

          {isAssigned && (
            <div style={{ marginTop: "12px" }}>
              <strong>Assigned:</strong>{" "}
              {task.assigneeLabel || localAssigneeId}
            </div>
          )}

          {canStartExecution && (
            <div style={{ marginTop: "16px" }}>
              <button onClick={handleStartWork}>
                Start work
              </button>
            </div>
          )}

          {/* ---------------- Notes ---------------- */}
          <div style={{ marginTop: "20px" }}>
            <strong style={{ display: "block", marginBottom: "6px" }}>
              Notes
            </strong>

            <div style={{ lineHeight: "1.5" }}>
              {Array.isArray(task.notes) &&
                task.notes.map((n, i) => {
                  const system = isSystemNote(n);
                  const user = !system;
                  return (
                    <div
                      key={i}
                      style={{
                        marginBottom: "6px",
                        padding: system ? "6px 8px" : "4px 0",
                        background: system ? "#f5f5f5" : "transparent",
                        borderLeft: system ? "3px solid #bbb" : "none",
                        fontSize: system ? "13px" : "14px",
                        fontStyle: system ? "italic" : "normal",
                        color: system ? "#444" : "#000",
                      }}
                    >
                      {system && (
                        <span
                          style={{
                            display: "inline-block",
                            marginRight: "6px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontSize: "11px",
                            color: "#666",
                          }}
                        >
                          SYSTEM
                        </span>
                      )}

                      {user && (
                        <span
                          style={{
                            display: "inline-block",
                            marginRight: "6px",
                            fontSize: "11px",
                            color: "#777",
                          }}
                        >
                          ✓
                        </span>
                      )}

                      {system ? n.replace(/^\[System\]\s*/, "") : n}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ---------------- Draft ---------------- */}
          <div style={{ marginTop: "16px" }}>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Draft note (not committed)"
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: "6px" }}>
              <button onClick={commitDraft}>
                Commit note
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Footer ---------------- */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #eee",
          }}
        >
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
