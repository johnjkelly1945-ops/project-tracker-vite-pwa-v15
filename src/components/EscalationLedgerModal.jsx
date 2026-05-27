// @ts-nocheck
/*
=====================================================================
METRA — EscalationLedgerModal.jsx
Stage 422 — Phase 4 Ledger Navigation Wiring
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import EscalationModal from "./EscalationModal";
import {
  getEscalationsByTask,
  getEscalation
} from "../domain/escalation/EscalationStore";

export default function EscalationLedgerModal({ taskId, taskTitle, onClose }) {

  const [activeReference, setActiveReference] = useState(null);

  const escalations = getEscalationsByTask(taskId);

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

        <div
          style={{
            padding: "12px",
            background: "#fff",
            minWidth: "420px"
          }}
        >

          {/* Identity */}

          {taskTitle && (
            <div style={{ marginBottom: "6px", fontSize: "13px", opacity: 0.7 }}>
              Task — {taskTitle}
            </div>
          )}

          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Escalation Ledger
          </div>

          {/* Ledger List */}

          {escalations.length === 0 && (
            <div style={{ fontSize: "13px", opacity: 0.7 }}>
              No escalations recorded.
            </div>
          )}

          {escalations.map((e) => (
            <div
              key={e.reference}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                cursor: "pointer"
              }}
              onClick={() => setActiveReference(e.reference)}
            >
              <div style={{ fontWeight: "bold", color: "#0b5ed7" }}>
                ESC-{String(e.reference).padStart(3, "0")} — {e.title}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Advisory count: {e.advisoryRecords.length}
              </div>

                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  Scope: {e.visibilityScope || "INTERNAL"}
                </div>
                  <div style={{ fontSize: "11px", opacity: 0.7 }}>
                    Status: {e.status || "OPEN"}
                  </div>
            </div>
          ))}

          {/* Footer */}

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
          readOnly={true}
          onClose={() => setActiveReference(null)}
        />
      )}

    </div>
  );
}
