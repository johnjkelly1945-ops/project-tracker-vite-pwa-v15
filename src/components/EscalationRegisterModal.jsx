// @ts-nocheck
/*
=====================================================================
METRA — EscalationRegisterModal.jsx
Stage 389 — Escalation Register Surface
=====================================================================

Purpose
Operational escalation register for a task.

Rules

• Operational escalation only
• Not a governance artefact
• Multiple escalation records per task allowed
• Opens EscalationModal for discussion

=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import EscalationModal from "./EscalationModal";

/*
Temporary in-memory escalation store.
Stage 389 foundation only.
*/
const escalations = [];

export default function EscalationRegisterModal({ taskId, onClose }) {

  const [, refresh] = useState(0);

  const [activeEscalationId, setActiveEscalationId] = useState(null);

  const taskEscalations =
    escalations.filter(e => e.taskId === taskId);

  function createEscalation() {

    const escalation = {
      escalationId: crypto.randomUUID(),
      taskId,
      createdDate: new Date().toISOString(),
      type: "",
      participants: "",
      outcome: "open"
    };

    escalations.push(escalation);

    setActiveEscalationId(escalation.escalationId);

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

          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Escalation Register
          </div>

          <div style={{ marginBottom: "12px" }}>
            <button onClick={createEscalation}>
              Create Escalation
            </button>
          </div>

          {taskEscalations.map(e => (

            <div
              key={e.escalationId}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                cursor: "pointer"
              }}
              onClick={() => setActiveEscalationId(e.escalationId)}
            >

              <div style={{ fontWeight: "bold", color: "#0b5ed7" }}>
                Escalation — {e.escalationId.slice(0,8)}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {e.outcome || "Open"}
              </div>

            </div>

          ))}

          <div style={{ marginTop: "12px" }}>
            <button onClick={onClose}>Close</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>

      {activeEscalation && (
        <EscalationModal
          taskId={taskId}
          onClose={() => setActiveEscalationId(null)}
        />
      )}

    </div>
  );
}
