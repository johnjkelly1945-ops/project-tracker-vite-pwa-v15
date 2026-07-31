// @ts-nocheck
/*
=====================================================================
METRA — QCRegisterModal.jsx
Stage 378 — QC Register Editing Surface
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import { createQCArtefact, getQCArtefacts, updateQCArtefact } from "../domain/governance/GovernanceStore";
import { createGovernanceEvent } from "../governance/governanceStore";
import { getGovernanceEventsByTask } from "../governance/governanceStore";
import { getActingUser } from "../domain/actor/ActingUser";

export default function QCRegisterModal({ taskId, taskTitle, segmentId, onClose, openQCEvent, isPM = false, readOnly = false, constitutionalEngagement }) {

  const [, refresh] = useState(0);

  const [creating, setCreating] = useState(false);
  const [editingQC, setEditingQC] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    probability: "",
    impact: "",
    owner: "",
    mitigation: ""
  });

  const actor = getActingUser();

  const advisoryQCArtefactIds = new Set(
    getGovernanceEventsByTask(taskId)
      .filter(e =>
        e.eventType === "QC" &&
        Array.isArray(e.participation) &&
        e.participation.some(p => p && p.reviewerId === actor?.id)
      )
      .map(e => e.artefactId)
      .filter(Boolean)
  );
  const qcs =
    getQCArtefacts()
      .filter(qc =>
          qc.segmentId === segmentId &&
          (
            isPM ||
            constitutionalEngagement?.responsibility === "QC_INSPECTION" ||
            advisoryQCArtefactIds.has(qc.artefactId)
          )
      )

  function saveEntry() {

    if (editingQC) {

      updateQCArtefact(editingQC.artefactId, {
        title: form.title,
        description: form.description,
        probability: form.probability,
        impact: form.impact,
        owner: form.owner,
        mitigation: form.mitigation
      });

      setEditingQC(null);
      setCreating(false);

    } else {

      const r = createQCArtefact(segmentId, taskId, taskTitle);

      updateQCArtefact(r.artefactId, {
        title: form.title,
        description: form.description,
        probability: form.probability,
        impact: form.impact,
        owner: form.owner,
        mitigation: form.mitigation
      });

      setCreating(false);
    }

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

  function resetForm() {

    setCreating(false);
    setEditingQC(null);

    setForm({
      title: "",
      description: "",
      probability: "",
      impact: "",
      owner: "",
      mitigation: ""
    });
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
            QC Register
          </div>

          {(creating || editingQC) && (

            <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "12px" }}>

              <input
                placeholder="QC title"
                value={form.title}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <textarea
                placeholder="Description"
                value={form.description}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Probability"
                value={form.probability}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, probability: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Impact"
                value={form.impact}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, impact: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <input
                placeholder="Owner"
                value={form.owner}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <textarea
                placeholder="Mitigation"
                value={form.mitigation}
                  readOnly={readOnly}
                  onChange={e => setForm({ ...form, mitigation: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <div style={{ marginTop: "8px" }}>

                  {!readOnly && (
                  <button onClick={saveEntry}>
                    {editingQC ? "Update QC" : "Create QC"}
                  </button>
                )}

                <button
                  style={{ marginLeft: "8px" }}
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
          {qcs.map(qc => (

            <div
              key={qc.artefactId}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f8ff"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >

              <div
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#0b5ed7",
                  textDecoration: "underline"
                }}
                onClick={() => {

                  setEditingQC(qc);
                  setCreating(false);

                  setForm({
                    title: qc.title || "",
                    description: qc.description || "",
                    probability: qc.probability || "",
                    impact: qc.impact || "",
                    owner: qc.owner || "",
                    mitigation: qc.mitigation || ""
                  });

                }}
              >
                {qc.reference + (qc.title ? " — " + qc.title : "")}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {qc.status || "Open"}
              </div>

              <div style={{ marginTop: "6px" }}>
                  <button onClick={() => openQCEvent(createGovernanceEvent({ eventType: "QC", taskId, initiatedBy: "PM", artefactId: qc.artefactId, segmentId }).eventId)}>
                  Advisory
                </button>
              </div>

            </div>

          ))}
          </div>

            {!readOnly && (
              <div style={{ marginTop: "16px" }}>
                <button onClick={() => setCreating(true)}>
                  New QC
                </button>
              </div>
            )}

          <div style={{ marginTop: "10px" }}>
            <button onClick={onClose}>Close</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>
    </div>
  );
}
