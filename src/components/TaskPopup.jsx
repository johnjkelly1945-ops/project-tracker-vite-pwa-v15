// @ts-nocheck
/*
=====================================================================
METRA — TaskPopup.jsx
Stage 222A — TaskPopup Shell & Layout Restoration
---------------------------------------------------------------------
Structural restoration ONLY.
No behavioural, semantic, or authority changes.
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

  /* ---------------- Local mirrors ---------------- */

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
    setLocalAssigneeId(selectedAssigneeId);
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  function handleCancelAssignment() {
    setSelectedAssigneeId("");
    setAssigning(false);
  }

  /* ---------------- Execution ---------------- */

  const executionState =
    (localExecutionState || "NOT_STARTED").replace(" ", "_");

  const isAssignee = localAssigneeId === "current-user";

  const canStartExecution =
    isAssigned &&
    isAssignee &&
    executionState === "NOT_STARTED";

  function handleStartWork() {
    if (!canStartExecution) return;
    onAddNote(task.id, "[System] Execution started");
    onStartExecution(task.id);
    setLocalExecutionState("IN_PROGRESS");
  }

  /* ---------------- Summary Association ---------------- */

  const currentSummaryId = task.summaryId || "";
  const [summaryEditing, setSummaryEditing] = useState(false);
  const [selectedSummaryId, setSelectedSummaryId] = useState(
    currentSummaryId
  );

  function confirmSummaryAssociation() {
    if (selectedSummaryId !== currentSummaryId) {
      onChangeTaskSummary(task.id, selectedSummaryId || null);
    }
    setSummaryEditing(false);
  }

  function cancelSummaryAssociation() {
    setSelectedSummaryId(currentSummaryId);
    setSummaryEditing(false);
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
          width: "90%",
          maxWidth: "90%",
          height: "80vh",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ---------------- Header (fixed) ---------------- */}
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

        {/* ---------------- Notes Viewport (ONLY scroll region) ---------------- */}
        <div
          style={{
            padding: "20px 16px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* -------- Summary Association -------- */}
          <div style={{ marginBottom: "16px" }}>
            <strong>Summary</strong>

            {!summaryEditing && (
              <div style={{ marginTop: "6px" }}>
                <div style={{ marginBottom: "6px" }}>
                  {summaries.find((s) => s.id === currentSummaryId)?.title ||
                    "Unassigned"}
                </div>
                <button onClick={() => setSummaryEditing(true)}>
                  Associate with summary
                </button>
              </div>
            )}

            {summaryEditing && (
              <div style={{ marginTop: "6px" }}>
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

                <div style={{ marginTop: "8px" }}>
                  <button onClick={confirmSummaryAssociation}>
                    Confirm association
                  </button>
                  <button onClick={cancelSummaryAssociation}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* -------- Assignment -------- */}
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
                  return (
                    <div
                      key={i}
                      style={{
                        marginBottom: "6px",
                        padding: system ? "6px 8px" : "4px 0",
                        background: system ? "#f5f5f5" : "transparent",
                        borderLeft: system ? "3px solid #bbb" : "none",
                        fontStyle: system ? "italic" : "normal",
                      }}
                    >
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

        {/* ---------------- Footer (fixed, non-scrolling) ---------------- */}
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
