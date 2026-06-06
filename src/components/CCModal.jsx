// @ts-nocheck
/*
=====================================================================
METRA — CCModal.jsx
Stage 335 — CC Governance Surface (Parallel to Risk)

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
import { getGovernanceEvent } from "../governance/governanceStore";
import { closeGovernanceEvent } from "../governance/governanceEngine";
import { getChangeArtefactById } from "../domain/governance/GovernanceStore";
import SubordinateSelectionModal from "./SubordinateSelectionModal";
import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";
import TaskDescriptionModal from "./TaskDescriptionModal";
import { personnel } from "../data/personnel";
import { getPersonnel } from "../domain/personnel/PersonnelRegistry";

import { createDocument } from "../domain/documents/DocumentStore";
import { resolveDocuments } from "../domain/documents/DocumentStore";
import { getActingUser } from "../domain/actor/ActingUser";
import DocumentEntryModal from "./DocumentEntryModal";
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

export default function CCModal({ taskId, taskTitle, eventId, onClose, onAddNote, onEscalate, isPM, readOnly = false }) {
  const inlineRef = useRef(null);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [advisoryText, setAdvisoryText] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionEntries, setDescriptionEntries] = useState([]);
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docRef, setDocRef] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [docModalOpen, setDocModalOpen] = useState(false);

  const actor = getActingUser();
  const [event, setEvent] = useState(() =>
    getGovernanceEvent(eventId)
  );
  const artefact = event?.artefactId ? getChangeArtefactById(event.artefactId) : null;
  const documents = resolveDocuments({ eventId: event?.eventId });



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
        `[System] CC participant confirmed: ${person.displayName} — ${nowStamp()}`
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

  function handleCloseItem() {
    closeGovernanceEvent({ eventId });
    const fresh = getGovernanceEvent(eventId);
    if (fresh) setEvent({ ...fresh });
  }

  function handleAddDocument() {
    const name = docName.trim();
    const url = docUrl.trim();
    const reference = docRef.trim();

    if (!name) return;
    if (!url && !reference) return;

    try {
      createDocument({
        name,
        url,
        reference,
          taskId,
        eventId,
          taskTitle,
        addedBy: "PM",
      });

      if (onAddNote) {
        onAddNote(
          taskId,
          `[System] Document attached by PM: ${name} — ${nowStamp()}`
        );
      }

      setDocName("");
      setDocUrl("");
      setDocRef("");
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
                  fontSize: "22px",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                }}
              >
                {artefact?.reference + (artefact?.title ? " — " + artefact.title : "")}
              </div>
              <div><strong>Task:</strong> {taskTitle}</div>
              <div><strong>Status:</strong> {event.status}</div>
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
              {event?.advisoryRecords.map((adv) => (
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
                <button disabled={readOnly} onClick={handleCommitInlineAdvisory}>
                  Commit advisory
                </button>
              </div>
                  {/* Documents Section (Stage 469) */}
                  <div style={{ marginTop: "12px", width: "100%", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", marginBottom: "4px" }}><span>📎 Documents</span>{!readOnly && (<span style={{ fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#1976d2" }} onClick={() => setDocModalOpen(true)}>Add</span>)}</div>
                    <div style={{ marginTop: "6px", fontSize: "13px" }}>
                      <div style={{ fontSize: "13px", color: "#555" }}>
                        {documents.length === 0 ? (
                          "(no documents yet)"
                        ) : (
                          documents.map((d) => (
                            <div key={d.id}>
                                {(typeof d.url === "string" && d.url.trim() !== "") ? (<span title={d.url} style={{ color: "#0b3a66", textDecoration: "underline", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); try { const raw = d.url.trim(); const finalUrl = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`; new URL(finalUrl); window.open(finalUrl, "_blank", "noopener,noreferrer"); } catch (err) { console.warn("Blocked invalid URL:", d.url); } }}>{d.name}</span>) : (<span title={d.reference || ""}>{d.name}</span>)}
                            </div>
                          ))
                        )}
                      </div>
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
              {isPM && event?.status === "OPEN" && (<button onClick={handleCloseItem}>Close Item</button>)}              {isPM && <button onClick={onEscalate} disabled={isEscalated}>Escalate</button>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {isPM && (
                <button disabled={readOnly} onClick={() => setParticipantModalOpen(true)}>
                  Confirm Participant
                </button>
              )}

              <button onClick={onClose}>Close</button>
            </div>
          </div>
        </div>

        {participantModalOpen && (
          <SubordinateSelectionModal
            title="Confirm CC Participant"
            items={[]}
            onSelect={confirmParticipant}
            onClose={() => setParticipantModalOpen(false)}
          />
        )}

          <DocumentEntryModal
            open={docModalOpen}
            onClose={() => setDocModalOpen(false)}
            onConfirm={({ name, location }) => {
              createDocument({
                eventId,
                taskId,
                name,
                url: location,
                taskTitle,
                reference: location,
                addedBy: actor?.displayName || actor?.id || "system",
              });
              setRefreshTick((t) => t + 1);
              setDocModalOpen(false);
            }}
          />
      </div>
    </GovernanceSurfaceContainer>
  );
}
