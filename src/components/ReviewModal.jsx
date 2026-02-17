// @ts-nocheck
/*
=====================================================================
METRA — ReviewModal.jsx
Stage 320A — Review Governance Surface (Advisory Overlay)
Stage 329 — Phase 2A (Wrapped in GovernanceSurfaceContainer)
Stage 329 — Phase 2B Step 1 (Identity Zone Introduction)
Stage 329 — Phase 2B Step 2 (SEM-TS Zone Formalisation)
Stage 329 — Phase 2B Step 3 (Mutation Boundary Alignment)
Stage 329 — Phase 2B Step 3A (Flex Height Constraint Fix)
Stage 329 — Phase 2B Step 3B (Flex Scroll Containment Fix)
---------------------------------------------------------------------
• Advisory only
• No lifecycle mutation
• No decision control
• No document storage
• Multi-participant confirmation permitted
• Structural wrapper introduced (no behavioural delta)
• Identity zone introduced (render-only)
• Zones formalised (Identity / Stream / Footer)
• Confirm Participant relocated to footer (no behavioural delta)
• Height constraint corrected for scroll enforcement
• minHeight applied for flex scroll containment
=====================================================================
*/

import { useState } from "react";
import { bridgeRecordParticipation, bridgeSubmitAdvisory } from "../governance/governanceBridge";
import { getGovernanceEvent } from "../governance/governanceStore";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
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

  const [event, setEvent] = useState(() =>
    getGovernanceEvent(eventId)
  );

  const participantIds = event?.participation
    ? [...new Set(event.participation.map(p => p.reviewerId))]
    : [];

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
  }

  return (
    <GovernanceSurfaceContainer>
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
            height: "80vh",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* ================= Identity Zone ================= */}

          {event && (
            <div
              style={{
                padding: "15px 20px",
                borderBottom: "1px solid #e5e5e5",
                fontSize: "13px",
              }}
            >
              <div><strong>Type:</strong> Review</div>
              <div><strong>Event ID:</strong> {event.eventId}</div>
              <div><strong>Task:</strong> {event.taskId}</div>
              <div><strong>Status:</strong> {event.status}</div>
              <div>
                <strong>Participants:</strong>{" "}
                {participantIds.length > 0
                  ? participantIds.join(", ")
                  : "None confirmed"}
              </div>
            </div>
          )}

          {/* ================= Transaction Stream ================= */}

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "15px 20px",
            }}
          >
            <h3>Review Advisory</h3>

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
          </div>

          {/* ================= Footer (Mutation Boundary) ================= */}

          <div
            style={{
              borderTop: "1px solid #e5e5e5",
              padding: "15px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={() => setParticipantModalOpen(true)}>
              Confirm Participant
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={recordAdvisory}>Record Advisory</button>
              <button onClick={onClose}>Close</button>
            </div>
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
    </GovernanceSurfaceContainer>
  );
}
