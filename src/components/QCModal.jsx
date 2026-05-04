// @ts-nocheck
/*
=====================================================================
METRA — QCModal.jsx
Stage 334 — QC Governance Surface (Parallel to Risk)

---------------------------------------------------------------------
• Advisory only
• No lifecycle mutation
• No decision control
• No document storage
• Identity / Stream / Footer zones enforced
• Scroll containment preserved
• Commit grammar mirrors TaskPopup
• Escalate render-only (no wiring)
• ZERO semantic delta relative to Risk
=====================================================================
*/

import { useState, useRef, useEffect } from "react";
import {
  bridgeRecordParticipation,
  bridgeSubmitAdvisory,
} from "../governance/governanceBridge";
import { getGovernanceEvent } from "../governance/governanceStore";
import { getQCArtefactById } from "../domain/governance/GovernanceStore";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import TaskDescriptionModal from "./TaskDescriptionModal";
import { personnel } from "../data/personnel";
import { getPersonnel } from "../domain/personnel/PersonnelRegistry";
import { getActingUser } from "../domain/actor/ActingUser";
import { resolveDocuments, createDocument } from "../domain/documents/DocumentStore";

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

export default function QCModal({ taskId, taskTitle, eventId, onClose, onAddNote, onEscalate }) {
  const inlineRef = useRef(null);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [advisoryText, setAdvisoryText] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionEntries, setDescriptionEntries] = useState([]);

const [event, setEvent] = useState(null);
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docRef, setDocRef] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);


useEffect(() => {
  if (!eventId) return;
  const loaded = getGovernanceEvent(eventId);
  if (loaded) setEvent(loaded);
}, [eventId]);

if (!event) return null;

  const artefact = event?.artefactId ? getQCArtefactById(event.artefactId) : null;
  const documents = resolveDocuments({ eventId: event?.eventId });

  function handleLinkDocument() {
    if (!docName || (!docUrl && !docRef)) return;

    createDocument({
      name: docName,
      url: docUrl,
      reference: docRef,
      eventId: event?.eventId,
      addedBy: actor?.displayName || actor?.id || "system"
    });

    onAddNote && onAddNote(
      taskId,
      `[System] Document attached by ${actor?.displayName || actor?.id || "system"}: ${docName} — ${nowStamp()}`
    );

    setDocName("");
    setDocUrl("");
    setDocRef("");
    setRefreshTick((t) => t + 1);
  }
  const actor = getActingUser();
  const isPM = actor?.isPM === true;



  const isEscalated = event?.escalated === true;
  const participantIds = event?.participation
    ? [...new Set(event.participation.map((p) => p.reviewerId))]
    : [];

  const participantNames = participantIds
    .map((id) => getPersonnel().find((p) => p.id === id)?.displayName)
    .filter(Boolean);

  /* ================= Participation ================= */

  function confirmParticipant(person) {
    const updated = bridgeRecordParticipation({
      eventId,
      reviewerId: person.id,
      participationType: "internal",
      acceptedBy: "PM",
    });

    setEvent(updated);

    if (onAddNote) {
      onAddNote(
        taskId,
        `[System] QC participant confirmed: ${person.displayName} — ${nowStamp()}`
      );
    }

    setParticipantModalOpen(false);
  }

  /* ================= Inline Commit ================= */

  function handleCommitInlineAdvisory() {
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

    if (inlineRef.current) inlineRef.current.focus();
  }

  /* ================= Render ================= */

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
          {/* ================= Identity Zone ================= */}

          {event && (
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
                  fontSize: "18px",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                }}
              >
                QC — {artefact?.reference} — {artefact?.title || "Untitled"}
              </div>

              <div><strong>Task:</strong> {taskTitle}</div>

              <div>
                <strong>Participants:</strong>{" "}
                {participantNames.length > 0
                  ? participantNames.join(", ")
                  : "None confirmed"}
              </div>
            </div>
          )}
          {descriptionOpen && (
            <TaskDescriptionModal
              taskId={event.eventId}
              entries={descriptionEntries}
              onAddDescription={(id, text) => setDescriptionEntries(prev => [...prev, text])}
              onClose={() => setDescriptionOpen(false)}
              currentUserRole="PM"
            />
          )}          {/* ================= Stream Zone ================= */}

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <strong>Advisory Notes</strong>

            <div style={{ marginTop: "12px" }}>
{(Array.isArray(event?.advisoryRecords) ? event.advisoryRecords : []).map((adv) => (
                <div key={adv.advisoryId} style={{ marginBottom: "16px" }}>
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
                    — {new Date(adv.submittedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Inline transaction input (TaskPopup grammar) */}

            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid rgba(0,0,0,0.1)",
                paddingTop: "12px",
              }}
            >
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
                value={advisoryText}
                onChange={(e) => setAdvisoryText(e.target.value)}
              />

              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <button onClick={handleCommitInlineAdvisory}>
                  Commit advisory
                </button>
              </div>
            </div>
          </div>

          {/* ================= Footer (Canonical Band) ================= */}

          <div
            style={{
              borderTop: "1px solid rgba(11,58,102,0.25)",
              background: "rgba(11,58,102,0.10)",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {isPM && <button onClick={onEscalate} disabled={isEscalated}>Escalate</button>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {isPM && <button onClick={() => setParticipantModalOpen(true)}>
                Confirm Participant
              </button>}

              <button onClick={onClose}>Close</button>
            </div>
          </div>
        </div>

        {participantModalOpen && (
          <SubordinateSelectionModal
            title="Confirm QC Participant"
            items={[]}
            onSelect={confirmParticipant}
            onClose={() => setParticipantModalOpen(false)}
          />
        )}
      </div>
    </GovernanceSurfaceContainer>
  );
}
