// @ts-nocheck
/*
=====================================================================
METRA — IssueModal.jsx
Stage 331 — Issue Governance Surface (Parallel to Review)

---------------------------------------------------------------------
• Advisory only
• No lifecycle mutation
• No decision control
• No document storage
• Identity / Stream / Footer zones enforced
• Scroll containment preserved
• Commit grammar mirrors TaskPopup
• Escalate render-only (no wiring)
• ZERO semantic delta relative to Review
=====================================================================
*/

import { useState, useRef, useEffect } from "react";
import {
  bridgeRecordParticipation,
  bridgeSubmitAdvisory,
} from "../governance/governanceBridge";
import { getGovernanceEvent, getGovernanceEventsByTask } from "../governance/governanceStore";
import { closeGovernanceEvent } from "../governance/governanceEngine";
import { getIssueArtefactById } from "../domain/governance/GovernanceStore";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import TaskDescriptionModal from "./TaskDescriptionModal";
import { personnel } from "../data/personnel";
import { getPersonnel } from "../domain/personnel/PersonnelRegistry";
import { resolveDocuments, createDocument } from "../domain/documents/DocumentStore";
import { getActingUser } from "../domain/actor/ActingUser";

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

export default function IssueModal({ taskId, taskTitle, eventId, onClose, onAddNote, onEscalate }) {
  const inlineRef = useRef(null);
  const actor = getActingUser();
  const isPM = actor?.isPM === true;
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [advisoryText, setAdvisoryText] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionEntries, setDescriptionEntries] = useState([]);

  const [event, setEvent] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!eventId) return;

    const loaded = getGovernanceEvent(eventId);
    if (loaded) setEvent(loaded);
  }, [eventId, refreshTick]);


  if (!event) return null;

  const issue = event?.artefactId ? getIssueArtefactById(event.artefactId) : null;

    const documents = resolveDocuments({
      eventId: event?.eventId,
    });




  /* ================= Task Issue Register ================= */

  const taskIssues = getGovernanceEventsByTask(taskId)
    .filter((e) => e.eventType === "ISSUE");
  const isEscalated = event?.escalated === true;
  const participantIds = Array.isArray(event?.participation) ? [...new Set(event.participation.map((p) => p.reviewerId))] : [];

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
        `[System] Issue participant confirmed: ${person.displayName} — ${nowStamp()}`
      );
    }

    setParticipantModalOpen(false);
  }

  /* ================= Inline Commit ================= */


  function handleCloseItem() {
    closeGovernanceEvent({ eventId });
    const fresh = getGovernanceEvent(eventId);
    if (fresh) setEvent({ ...fresh });
  }
  function handleCommitInlineAdvisory() {
    const summary = advisoryText.trim();
    if (!summary) return;

    const updated = bridgeSubmitAdvisory({
      eventId,
      submittedBy: "PM",
      summary,
      artefactId: event?.artefactId,
      templateId: null,
    });

    setEvent(updated);

    if (onAddNote) {
      onAddNote(taskId, `[System] Advisory recorded — ${nowStamp()}`);
    }

    setAdvisoryText("");

    if (inlineRef.current) inlineRef.current.focus();
  }



  function handleLinkDocument() {
    try {
      createDocument({
        name: "Test Document",
        url: "https://www.google.com",
        eventId: event?.eventId,
        addedBy: actor?.displayName || actor?.id || "system",
      });

      setRefreshTick((t) => t + 1);

    } catch (e) {
      console.error(e);
      alert(e.message);
    }
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
                <div>Issue — {issue?.reference} — {issue?.title || "Untitled"}</div>
                <div>Status: {event?.status || "OPEN"}</div>
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
              taskId={taskId}
              entries={descriptionEntries}
              onAddDescription={(taskId, stamped) =>
                setDescriptionEntries((prev) => [...prev, stamped])
              }
              onClose={() => setDescriptionOpen(false)}
              currentUserRole="PM"
            />
          )}


          {/* ================= Stream Zone ================= */}

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

                {/* Documents Section (Stage 466) */}
                <div style={{ marginTop: "12px", width: "100%", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    📎 Documents
                  </div>
                    <div style={{ fontSize: "13px", color: "#555" }}>
                      {documents.length === 0 ? (
                        "(no documents yet)"
                      ) : (
                        documents.map((d) => (
                          <div key={d.id}>
                            <a href={d.url} target="_blank" rel="noreferrer">
                              {d.name}
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  <div
                    style={{
                      marginTop: "6px",
                      cursor: "pointer",
                      color: "#0b3a66",
                      textDecoration: "underline",
                      fontSize: "13px"
                    }}
                    onClick={handleLinkDocument}
                  >
                    + Link document
                  </div>
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
                color: "#333",
              }}
            >
              {isPM && event?.status === "OPEN" && (<button onClick={handleCloseItem}>Close Item</button>)}
              {isPM && <button onClick={onEscalate} disabled={isEscalated}>Escalate</button>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {isPM && <button onClick={() => setParticipantModalOpen(true)}>Confirm Participant</button>}

              <button onClick={onClose}>Close</button>
            </div>
          </div>

        </div>
        {participantModalOpen && (
          <SubordinateSelectionModal
            title="Confirm Issue Participant"
            items={[]}
            onSelect={confirmParticipant}
            onClose={() => setParticipantModalOpen(false)}
          />
        )}
      </div>
    </GovernanceSurfaceContainer>
  );
}
