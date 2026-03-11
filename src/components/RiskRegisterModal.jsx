// @ts-nocheck
/*
=====================================================================
METRA — RiskRegisterModal.jsx
Stage 376 — Risk Register Entry Surface
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import { createRiskArtefact, getRiskArtefacts } from "../domain/governance/GovernanceStore";
import { createGovernanceEvent } from "../governance/governanceStore";

export default function RiskRegisterModal({ taskId, onClose, openRiskEvent }) {

  const [, refresh] = useState(0);

  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    probability: "",
    impact: "",
    owner: "",
    mitigation: ""
  });

  const risks =
    getRiskArtefacts()
      .filter(risk => risk.taskId === taskId);

  function createEntry() {

    const r = createRiskArtefact({
      title: form.title,
      description: form.description,
      probability: form.probability,
      impact: form.impact,
      owner: form.owner,
      mitigation: form.mitigation
    }, taskId);

    setCreating(false);

    setForm({
      title: "",
      description: "",
      probability: "",
      impact: "",
      owner: "",
      mitigation: ""
    });

    refresh(x => x + 1);
  }

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

          {creating && (

            <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "12px" }}>

              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                New Risk
              </div>

              <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Probability"
                value={form.probability}
                onChange={e => setForm({ ...form, probability: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Impact"
                value={form.impact}
                onChange={e => setForm({ ...form, impact: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Owner"
                value={form.owner}
                onChange={e => setForm({ ...form, owner: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <textarea
                placeholder="Mitigation"
                value={form.mitigation}
                onChange={e => setForm({ ...form, mitigation: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <button onClick={createEntry}>
                Create Entry
              </button>

            </div>

          )}

          {risks.length === 0 && (
            <div style={{ opacity: 0.6 }}>
              No risks recorded for this task
            </div>
          )}

          {risks.map(risk => (
            <div
              key={risk.artefactId}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0"
              }}
            >

              <div style={{ fontWeight: "bold" }}>
                {risk.title || risk.reference}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {risk.status || "Open"}
              </div>

              <div style={{ marginTop: "6px" }}>
                <button onClick={() => openRiskEvent(createGovernanceEvent({ eventType: "RISK", taskId, initiatedBy: "PM" }).eventId)}>
                  Advisory
                </button>
              </div>

            </div>
          ))}

          <div style={{ marginTop: "16px" }}>
            <button onClick={() => setCreating(true)}>
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
