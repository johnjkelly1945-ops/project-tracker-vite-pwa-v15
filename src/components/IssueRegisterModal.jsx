// @ts-nocheck
/*
=====================================================================
METRA — IssueRegisterModal.jsx
Stage 379 — Issue Register Editing Surface
=====================================================================
*/

import { useState } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import { createIssueArtefact, getIssueArtefacts, updateIssueArtefact } from "../domain/governance/GovernanceStore";
import { createGovernanceEvent } from "../governance/governanceStore";

export default function IssueRegisterModal({ taskId, onClose, openIssueEvent }) {

  const [, refresh] = useState(0);

  const [creating, setCreating] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    owner: "",
    resolution: ""
  });

  const issues =
    getIssueArtefacts()
      .filter(issue => issue.taskId === taskId);

  function saveEntry() {

    if (editingIssue) {

      updateIssueArtefact(editingIssue.artefactId, {
        title: form.title,
        description: form.description,
        owner: form.owner,
        resolution: form.resolution
      });

      setEditingIssue(null);
      setCreating(false);

    } else {

      const r = createIssueArtefact(null, taskId);

      updateIssueArtefact(r.artefactId, {
        title: form.title,
        description: form.description,
        owner: form.owner,
        resolution: form.resolution
      });

      setCreating(false);
    }

    setForm({
      title: "",
      description: "",
      owner: "",
      resolution: ""
    });

    refresh(x => x + 1);
  }

  function resetForm() {

    setCreating(false);
    setEditingIssue(null);

    setForm({
      title: "",
      description: "",
      owner: "",
      resolution: ""
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
            Issue Register
          </div>

          {(creating || editingIssue) && (

            <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "12px" }}>

              <input
                placeholder="Issue title"
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
                placeholder="Owner"
                value={form.owner}
                onChange={e => setForm({ ...form, owner: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <textarea
                placeholder="Resolution"
                value={form.resolution}
                onChange={e => setForm({ ...form, resolution: e.target.value })}
                style={{ width: "100%", marginBottom: "6px" }}
              />

              <div style={{ marginTop: "8px" }}>

                <button onClick={saveEntry}>
                  {editingIssue ? "Update Issue" : "Create Issue"}
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

          {issues.map(issue => (

            <div
              key={issue.artefactId}
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

                  setEditingIssue(issue);
                  setCreating(false);

                  setForm({
                    title: issue.title || "",
                    description: issue.description || "",
                    owner: issue.owner || "",
                    resolution: issue.resolution || ""
                  });

                }}
              >
                {issue.title || issue.reference}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {issue.status || "Open"}
              </div>

              <div style={{ marginTop: "6px" }}>
                <button onClick={() => openIssueEvent(createGovernanceEvent({ eventType: "ISSUE", taskId, initiatedBy: "PM", artefactId: issue.artefactId }).eventId)}>
                  Advisory
                </button>
              </div>

            </div>

          ))}

          <div style={{ marginTop: "16px" }}>
            <button onClick={() => setCreating(true)}>
              New Issue
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
