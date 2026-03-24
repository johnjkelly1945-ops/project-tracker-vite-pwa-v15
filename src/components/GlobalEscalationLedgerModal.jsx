// @ts-nocheck
/*
=====================================================================
METRA — GlobalEscalationLedgerModal.jsx
Stage 423 — Phase 2 Global Ledger Shell
=====================================================================
*/

import { getAllEscalations } from "../domain/escalation/EscalationStore";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";

export default function GlobalEscalationLedgerModal({ onClose }) {
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

          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Global Escalation Ledger
          </div>


          {/* Global Ledger List */}

          {(() => {
            const escalations = getAllEscalations();

            if (escalations.length === 0) {
              return (
                <div style={{ fontSize: "13px", opacity: 0.7 }}>
                  No escalations recorded.
                </div>
              );
            }

            return escalations.map((e) => (
              <div
                key={`${e.taskId}-${e.reference}`}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px 0"
                }}
              >
                <div style={{ fontWeight: "bold", color: "#0b5ed7" }}>
                  ESC-{String(e.reference).padStart(3, "0")} — {e.title}
                </div>

                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  Task: {e.taskId}
                </div>

                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  Advisory count: {e.advisoryRecords.length}
                </div>
              </div>
            ));
          })()}

          {/* Footer */}

          <div style={{ marginTop: "12px" }}>
            <button onClick={onClose}>Back</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>

    </div>
  );
}
