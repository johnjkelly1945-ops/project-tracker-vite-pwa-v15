// @ts-nocheck
/*
=====================================================================
METRA — EscalationModal.jsx
Stage 390 — Escalation Advisory Surface
Operational escalation (not governance)
=====================================================================
*/

import { useState, useRef } from "react";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import TaskDescriptionModal from "./TaskDescriptionModal";
import { personnel } from "../data/personnel";

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

export default function EscalationModal({ taskId, taskTitle, escalation, onClose }) {

  const inlineRef = useRef(null);

  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionEntries, setDescriptionEntries] = useState([]);
  const [classification, setClassification] = useState("");

  const participantNames = escalation.participants
    ? escalation.participants.split(",")
    : [];

  function handleCommitInlineAdvisory() {

    const text = draft.trim();
    if (!text) return;

    const entry = {
      id: Date.now(),
      summary: text,
      submittedAt: nowStamp()
    };

    if (!escalation.entries) escalation.entries = [];

    escalation.entries.push(entry);

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
          justifyContent: "center",
        }}
      >

        <div
          style={{
            background: "#fff",
            width: "90%",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "6px",
          }}
        >

          {/* Identity Zone */}

          <div
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              padding: "15px 20px",
              fontSize: "13px",
            }}
          >

            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: "22px",
                marginBottom: "10px",
              }}
            >
              Escalation — {escalation.reference || "001"} — {escalation.title || "Untitled"}
            </div>

            <div>
              <strong>ESC ID:</strong>{" "}
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setDescriptionOpen(true)}
              >
                {escalation.escalationId}
              </span>
            </div>

            <div><strong>Task:</strong> {taskTitle || taskId}</div>

            <div>
              <strong>Participants:</strong>{" "}
              {participantNames.length > 0
                ? participantNames.join(", ")
                : "None confirmed"}
            </div>

          </div>

          {descriptionOpen && (
            <TaskDescriptionModal
              taskId={taskId}
              entries={descriptionEntries}
              onAddDescription={(taskId, stamped) =>
                setDescriptionEntries((prev) => [...prev, stamped])
              }
              onClose={() => setDescriptionOpen(false)}
              currentUserRole="PM"
            />
          )}

          {/* Stream Zone */}

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

            <strong>Advisory Notes</strong>

            <div style={{ marginTop: "12px" }}>
              {(escalation.entries || []).map((adv) => (
                <div key={adv.id} style={{ marginBottom: "16px" }}>
                  <span style={{ whiteSpace: "pre-wrap" }}>
                    {adv.summary}
                  </span>
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    — {adv.submittedAt}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid rgba(0,0,0,0.1)",
                paddingTop: "12px",
              }}
            >


              <div style={{ marginBottom: "6px" }}>
                <strong>Classification</strong>
              </div>

              <select
                value={classification || ""}
                onChange={(e) => setClassification(e.target.value)}
                style={{ marginBottom: "10px" }}
              >
                <option value="">None</option>
                <option value="TECH">TECH</option>
                <option value="SCHED">SCHED</option>
                <option value="RES">RES</option>
                <option value="COMM">COMM</option>
                <option value="DES">DES</option>
                <option value="COMP">COMP</option>
                <option value="OTHER">OTHER</option>
              </select>

              <textarea
                ref={inlineRef}
                rows={3}
                style={{
                  width: "100%",
                  resize: "vertical",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Enter advisory..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />

              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <button onClick={handleCommitInlineAdvisory}>
                  Commit advisory
                </button>
              </div>

            </div>

          </div>

          {/* Footer */}

          <div
            style={{
              borderTop: "1px solid rgba(11,58,102,0.25)",
              background: "rgba(11,58,102,0.10)",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >

            <button onClick={() => setParticipantModalOpen(true)}>
              Confirm Participant
            </button>

            <button onClick={onClose}>
              Close
            </button>

          </div>

        </div>

        {participantModalOpen && (
          <SubordinateSelectionModal
            title="Confirm Escalation Participant"
            items={personnel}
            onSelect={(person) => {
              escalation.participants =
                escalation.participants
                  ? escalation.participants + "," + person.displayName
                  : person.displayName;

              setParticipantModalOpen(false);
            }}
            onClose={() => setParticipantModalOpen(false)}
          />
        )}

      </div>

    </GovernanceSurfaceContainer>
  );
}
