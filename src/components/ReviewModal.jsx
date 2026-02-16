// @ts-nocheck
/*
=====================================================================
METRA — ReviewModal.jsx
Stage 320A — Review Governance Surface (Advisory Overlay)
---------------------------------------------------------------------
• Advisory only
• No lifecycle mutation
• No decision control
• No document storage
• Multi-participant confirmation permitted
=====================================================================
*/

import { useState } from "react";
import { bridgeRecordParticipation, bridgeSubmitAdvisory } from "../governance/governanceBridge";
import { getGovernanceEvent } from "../governance/governanceStore";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import { personnel } from "../data/personnel";

/* ===================== Time Helper ===================== */

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

/* ===================== Component ===================== */

export default function ReviewModal({ taskId, eventId, onClose, onAddNote }) {
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [advisoryText, setAdvisoryText] = useState("");
  const [docName, setDocName] = useState("");
  const [docVersion, setDocVersion] = useState("");
  const [contextNote, setContextNote] = useState("");

  const [event, setEvent] = useState(() =>
    getGovernanceEvent(eventId)
  );

  function confirmParticipant(person) {
    const updated = bridgeRecordParticipation({
      eventId,
      reviewerId: person.id,
      participationType: "internal",
      acceptedBy: "PM",
    });

    setEvent(updated);

    if (onAddNote) {
      onAddNote(taskId, `[System] Review participant confirmed: ${person.displayName} — ${nowStamp()}`);
    }
    setParticipantModalOpen(false);
  }

  function recordAdvisory() {
    const summary = advisoryText.trim();
    if (!summary) return;

    const updated = bridgeSubmitAdvisory({
      eventId,
      submittedBy: "PM",
      summary,
      artefactId: null,
      templateId: null,
    });

    setEvent(updated);

    if (onAddNote) {
      onAddNote(taskId, `[System] Advisory recorded — ${nowStamp()}`);
    }

    setAdvisoryText("");
    setDocName("");
    setDocVersion("");
    setContextNote("");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "6px",
        }}
      >
        <h3>Review Advisory</h3>

        <div style={{ marginBottom: "15px" }}>
          <button onClick={() => setParticipantModalOpen(true)}>
            Confirm Participant
          </button>
        </div>

        {event && event.advisoryRecords.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <strong>Recorded Advisories</strong>
            {event.advisoryRecords.map((adv) => (
              <div
                key={adv.advisoryId}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  marginTop: "6px",
                  borderRadius: "4px",
                  background: "#fafafa",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(adv.submittedAt).toLocaleString()}
                </div>
                <div>{adv.summary}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <textarea
            rows={4}
            style={{ width: "100%" }}
            placeholder="Advisory summary (optional)"
            value={advisoryText}
            onChange={(e) => setAdvisoryText(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "right", marginTop: "15px" }}>
          <button onClick={recordAdvisory}>Record Advisory</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Close
          </button>
        </div>
      </div>

      {participantModalOpen && (
        <SubordinateSelectionModal
          title="Confirm Review Participant"
          items={personnel}
          onSelect={confirmParticipant}
          onClose={() => setParticipantModalOpen(false)}
        />
      )}
    </div>
  );
}
