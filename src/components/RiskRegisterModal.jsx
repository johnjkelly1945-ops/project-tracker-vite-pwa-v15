// @ts-nocheck
/*
=====================================================================
METRA — RiskRegisterModal.jsx
Stage 374 — Risk Register Navigation Surface
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import { getGovernanceEventsByTask } from "../governance/governanceStore";
import { createRiskArtefact } from "../domain/governance/GovernanceStore";

export default function RiskRegisterModal({ taskId, onClose, openRiskEvent }) {

  const [, refresh] = useState(0);

  const risks =
    getGovernanceEventsByTask(taskId)
      .filter(e => e.eventType === "RISK");

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
            Risk Register
          </div>

          {risks.length === 0 && (
            <div style={{ opacity: 0.6 }}>
              No risks recorded for this task
            </div>
          )}

          {risks.map(risk => (
            <div
              key={risk.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0"
              }}
            >

              <div style={{ fontWeight: "bold" }}>
                {risk.title || `Risk ${risk.id}`}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {risk.status || "Open"}
              </div>

              <div style={{ marginTop: "6px" }}>
                <button onClick={() => openRiskEvent(risk.id)}>
                  Advisory
                </button>
              </div>

            </div>
          ))}

          <div style={{ marginTop: "16px" }}>
            <button
              onClick={() => {
                const r = createRiskArtefact(null, taskId);
                openRiskEvent(r.eventId);
              }}
            >
              New Risk
            </button>
          </div>

          <div style={{ marginTop: "10px" }}>
            <button onClick={onClose}>Close</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>
    </div>
  );
}
