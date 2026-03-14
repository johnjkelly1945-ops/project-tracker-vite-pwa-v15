// @ts-nocheck
/*
=====================================================================
METRA — EscalationModal.jsx
Stage 387 — Operational Escalation Surface (Design Preparation)

NOT governance
Advisory discussion only
Append-only learning record
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
