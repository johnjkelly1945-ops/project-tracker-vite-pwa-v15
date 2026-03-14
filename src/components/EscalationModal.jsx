// @ts-nocheck
/*
=====================================================================
METRA — EscalationModal.jsx
Stage 388 — Escalation Surface Refinement

Operational escalation only
NOT governance escalation
Append-only discussion with structured escalation metadata
=====================================================================
*/

import { useState, useRef } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

export default function EscalationModal({ taskId, onClose, onAddNote }) {

  const inlineRef = useRef(null);

  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState("");

  // Stage 388 metadata
  const [type, setType] = useState("");
  const [participants, setParticipants] = useState("");
  const [outcome, setOutcome] = useState("");

  function handleCommit() {

    const text = draft.trim();
    if (!text) return;

    const entry = {
      id: Date.now(),
      text,
      timestamp: nowStamp()
    };

    setEntries((p) => [...p, entry]);

    if (onAddNote) {
      onAddNote(
        taskId,
        `[System] Escalation note recorded — ${nowStamp()}`
      );
    }

    setDraft("");

    if (inlineRef.current) inlineRef.current.focus();
  }

  return (
    <GovernanceSurfaceContainer>

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

        <div
          style={{
            background: "#fff",
            width: "90%",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "6px"
          }}
        >

          <div
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              padding: "15px 20px",
              textAlign: "center",
              fontSize: "13px"
            }}
          >
            Escalation discussion — Task {taskId}
          </div>

          {/* Stage 388 — Escalation Metadata Panel */}

          <div
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              padding: "12px 20px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              fontSize: "12px"
            }}
          >

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ padding: "6px" }}
            >
              <option value="">Type</option>
              <option value="schedule">Schedule</option>
              <option value="resource">Resource</option>
              <option value="scope">Scope</option>
              <option value="dependency">Dependency</option>
              <option value="external">External</option>
              <option value="delivery-risk">Delivery Risk</option>
            </select>

            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Participants"
              style={{ padding: "6px", flex: 1 }}
            />

            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              style={{ padding: "6px" }}
            >
              <option value="">Outcome</option>
              <option value="open">Open</option>
              <option value="mitigated">Mitigated</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated Operationally</option>
            </select>

          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px"
            }}
          >

            {entries.map((e) => (
              <div key={e.id} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {e.timestamp}
                </div>
                <div>{e.text}</div>
              </div>
            ))}

          </div>

          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.1)",
              padding: "15px",
              display: "flex",
              gap: "10px"
            }}
          >

            <input
              ref={inlineRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Record escalation note..."
              style={{ flex: 1, padding: "8px" }}
            />

            <button onClick={handleCommit}>
              Commit
            </button>

            <button onClick={onClose}>
              Close
            </button>

          </div>

        </div>

      </div>

    </GovernanceSurfaceContainer>
  );
}
