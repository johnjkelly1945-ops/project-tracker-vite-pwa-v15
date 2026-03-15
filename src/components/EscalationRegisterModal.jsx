// @ts-nocheck
/*
=====================================================================
METRA — EscalationRegisterModal.jsx
Stage 391 — Escalation Register Identity Stabilisation
=====================================================================

Purpose
Operational escalation register for a task.

Rules

• Operational escalation only
• Not a governance artefact
• Escalation number assigned only at creation
• Title captured before creation
• Title becomes immutable after creation
• Advisory discussion opened from register

=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import EscalationModal from "./EscalationModal";

/*
Temporary in-memory escalation store
*/
const escalations = [];

export default function EscalationRegisterModal({ taskId, taskTitle, onClose }) {

  const [, refresh] = useState(0);

  const [createMode, setCreateMode] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  const [activeEscalationId, setActiveEscalationId] = useState(null);

  const taskEscalations =
    escalations.filter(e => e.taskId === taskId);

  function commitCreateEscalation() {

    if (!draftTitle.trim()) return;

    const sequence = taskEscalations.length + 1;

    const escalation = {
      escalationId: crypto.randomUUID(),
      taskId,

      number: sequence,
      reference: sequence,

      title: draftTitle.trim(),
      createdDate: new Date().toISOString(),
      status: "Open"
    };

    escalations.push(escalation);

    setDraftTitle("");
    setCreateMode(false);

    refresh(x => x + 1);
  }

  const activeEscalation =
    escalations.find(e => e.escalationId === activeEscalationId);

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
                  key={e.escalationId}
                  style={{
                    borderBottom: "1px solid #ddd",
                    padding: "8px 0"
                  }}
                >

                  <div style={{ fontWeight: "bold", color: "#0b5ed7" }}>
                    ESC-{String(e.number).padStart(3,"0")} — {e.title}
                  </div>

                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    Status: {e.status}
                  </div>

                  <div style={{ marginTop: "6px" }}>
                    <button onClick={() => setActiveEscalationId(e.escalationId)}>
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
          escalation={activeEscalation}
          onClose={() => setActiveEscalationId(null)}
        />
      )}

    </div>
  );
}
