// @ts-nocheck
/*
=====================================================================
METRA — EscalationRegisterModal.jsx
Stage 421 — Escalation Register Canonical Store Integration
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import EscalationModal from "./EscalationModal";
import { getActingUser } from "../domain/actor/ActingUser";
import EscalationLedgerModal from "./EscalationLedgerModal";
import {
  createEscalation,
  getEscalationsByTask,
  getEscalation
} from "../domain/escalation/EscalationStore";
import { getGovernanceEventsByTask } from "../governance/governanceStore";

export default function EscalationRegisterModal({ taskId, taskTitle, segmentId, onClose, sourceType, sourceId, onNavigate, onAddNote }) {

  const actor = getActingUser();
  const isPM = actor?.id === "user-1"; // temporary restore of PM working behaviour

  const [, refresh] = useState(0);

  const [createMode, setCreateMode] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const [activeReference, setActiveReference] = useState(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);

  const taskEscalations = getEscalationsByTask(taskId);

  function commitCreateEscalation() {

    if (!draftTitle.trim()) return;

    createEscalation({
      taskId,
      title: draftTitle.trim(),
      classification: null,
      sourceType,
        sourceId: (getGovernanceEventsByTask(taskId).find(e => e.eventType === sourceType)?.eventId) || sourceId,
        segmentId,
    });
      if (onAddNote) {
        onAddNote(
          taskId,
          `[System] Escalation opened — Task: ${taskTitle} — Escalation visibility elevated`
        );
      }

    setDraftTitle("");
    setCreateMode(false);

    refresh(x => x + 1);
  }

  const activeEscalation =
    activeReference ? getEscalation(taskId, activeReference) : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <GovernanceSurfaceContainer>

        <div style={{ padding: "12px", background: "#fff", minWidth: "420px" }}>

          {taskTitle && (
            <div style={{ marginBottom: "6px", fontSize: "13px", opacity: 0.7 }}>
              Task — {taskTitle}
            </div>
          )}

          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Escalation Register
          </div>

          {!createMode && (

            <>

              {taskEscalations.map(e => (

                <div
                  key={e.reference}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px 0"
                  }}
                >

                  <div style={{ fontWeight: "bold", color: "#0b5ed7" }}>
                    ESC-{String(e.reference).padStart(3,"0")} — {e.title}
                  </div>

                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    Status: Open
                  </div>

                  {/* NEW — STAGE 428 SOURCE LABEL (READ-ONLY) */}
                  {e.sourceType && (
                    <div style={{ fontSize: "11px", opacity: 0.6 }}>
                      Source: {e.sourceType}
                    </div>
                  )}

                  <div style={{ marginTop: "6px" }}>
                    <button onClick={() => setActiveReference(e.reference)}>
                      Advisory
                    </button>
                  </div>

                </div>

              ))}

              <div style={{ marginTop: "12px" }}>
                <button onClick={() => setCreateMode(true)}>
                  New Escalation
                </button>
              </div>

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => {
                  if (isPM || actor?.permissions?.ledgerAccess === true) {
                    setLedgerOpen(true);
                  }
                }}>
                  Ledger
                </button>
              </div>

            </>
          )}

          {createMode && (

            <div style={{ marginTop: "10px" }}>

              <div style={{ marginBottom: "6px", fontWeight: "bold" }}>
                New Escalation
              </div>

              <input
                type="text"
                value={draftTitle}
                placeholder="Escalation title"
                onChange={(e) => setDraftTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "10px",
                  border: "1px solid #ccc"
                }}
              />

              <div>
                <button
                  onClick={commitCreateEscalation}
                  disabled={!draftTitle.trim()}
                >
                  Create
                </button>

                <button
                  style={{ marginLeft: "8px" }}
                  onClick={() => {
                    setCreateMode(false);
                    setDraftTitle("");
                  }}
                >
                  Cancel
                </button>
              </div>

            </div>

          )}

          <div style={{ marginTop: "12px" }}>
            <button onClick={onClose}>Back</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>

      {activeEscalation && (
        <EscalationModal
          taskId={taskId}
          taskTitle={taskTitle}
          escalation={activeEscalation}
          onClose={() => setActiveReference(null)}
            onAddNote={onAddNote}
        />
      )}

      {ledgerOpen && (
        <EscalationLedgerModal
          taskId={taskId}
          taskTitle={taskTitle}
          onClose={() => setLedgerOpen(false)}
        />
      )}

    </div>
  );
}
