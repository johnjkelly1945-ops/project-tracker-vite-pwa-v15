// @ts-nocheck
/*
=====================================================================
METRA — CCRegisterModal.jsx
Stage 378 — CC Register Editing Surface
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import { createChangeArtefact, getChangeArtefacts, updateChangeArtefact } from "../domain/governance/GovernanceStore";
import { createGovernanceEvent } from "../governance/governanceStore";

export default function CCRegisterModal({ taskId, onClose, openCCEvent }) {

  const [, refresh] = useState(0);

  const [creating, setCreating] = useState(false);
  const [editingCC, setEditingCC] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    probability: "",
    impact: "",
    owner: "",
    mitigation: ""
  });

  const ccs =
    getChangeArtefacts()
      .filter(cc => cc.taskId === taskId);

  function saveEntry() {

    if (editingCC) {

      updateChangeArtefact(editingCC.artefactId, {
        title: form.title,
        description: form.description,
        probability: form.probability,
        impact: form.impact,
        owner: form.owner,
        mitigation: form.mitigation
      });

      setEditingCC(null);
      setCreating(false);

    } else {

      const r = createChangeArtefact(null, taskId);

      updateChangeArtefact(r.artefactId, {
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
    setEditingCC(null);

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
            CC Register
          </div>

          {(creating || editingCC) && (

            <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "12px" }}>

              <input
                placeholder="CC title"
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

              <div style={{ marginTop: "8px" }}>

                <button onClick={saveEntry}>
                  {editingCC ? "Update CC" : "Create CC"}
                </button>

                <button
                  style={{ marginLeft: "8px" }}
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          {ccs.map(cc => (

            <div
              key={cc.artefactId}
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

                  setEditingCC(cc);
                  setCreating(false);

                  setForm({
                    title: cc.title || "",
                    description: cc.description || "",
                    probability: cc.probability || "",
                    impact: cc.impact || "",
                    owner: cc.owner || "",
                    mitigation: cc.mitigation || ""
                  });

                }}
              >
                {cc.reference + (cc.title ? " — " + cc.title : "")}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {cc.status || "Open"}
              </div>

              <div style={{ marginTop: "6px" }}>
                <button onClick={() => openCCEvent(createGovernanceEvent({ eventType: "CC", taskId, initiatedBy: "PM", artefactId: cc.artefactId }).eventId)}>
                  Advisory
                </button>
              </div>

            </div>

          ))}

          <div style={{ marginTop: "16px" }}>
            <button onClick={() => setCreating(true)}>
              New CC
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
