// @ts-nocheck
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
import { appendEscalationAdvisory } from "../domain/escalation/EscalationStore";
import { getActingUser } from "../domain/actor/ActingUser";
import { createDocument, resolveDocuments } from "../domain/documents/DocumentStore";
import DocumentEntryModal from "./DocumentEntryModal";
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

export default function EscalationModal({ taskId, taskTitle, escalation, onClose, readOnly = false }) {

  const inlineRef = useRef(null);

  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descriptionEntries, setDescriptionEntries] = useState([]);
  const [classification, setClassification] = useState("");
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const documents = resolveDocuments({
    reference: escalation?.reference
  });


  const participantNames = escalation.participants
    ? escalation.participants.split(",")
    : [];

  function handleCommitInlineAdvisory() {

    if (readOnly) return;

    const text = draft.trim();
    if (!text) return;

    appendEscalationAdvisory({
      taskId,
      reference: escalation.reference,
      summary: text,
      classification: classification || null,
      actor: getActingUser()
    });

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
          pointerEvents: readOnly ? "none" : "auto"
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
            pointerEvents: "auto"
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
              {(escalation.advisoryRecords || []).map((adv) => (
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
                    — {adv.submittedAt}
                  </span>
                </div>
              ))}
            </div>

            {!readOnly && (
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
                  {/* Documents Section (Stage 475C) */}
                  <div style={{ marginTop: "12px", width: "100%", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", marginBottom: "4px" }}>
                      <span>📎 Documents</span>
                      <span
                        style={{ fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#1976d2" }}
                        onClick={() => setDocModalOpen(true)}
                      >
                        Add
                      </span>
                    </div>

                    <div style={{ marginTop: "6px", fontSize: "13px" }}>
                      <div style={{ fontSize: "13px", color: "#555" }}>
                        {documents.length === 0 ? (
                          "(no documents yet)"
                        ) : (
                          documents.map((d) => (
                            <div key={d.id}>
                              {(typeof d.url === "string" && d.url.trim() !== "" && !d.url.startsWith("/") && !d.url.startsWith("'/") && (d.url.includes(".") || d.url.startsWith("http://") || d.url.startsWith("https://"))) ? (
                                <span
                                  title={d.url}
                                  style={{ color: "#0b3a66", textDecoration: "underline", cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    try {
                                      const raw = d.url.trim();

                                      const finalUrl =
                                        raw.startsWith("http://") ||
                                        raw.startsWith("https://")
                                          ? raw
                                          : `https://${raw}`;

                                      new URL(finalUrl);

                                      window.open(finalUrl, "_blank", "noopener,noreferrer");
                                    } catch (err) {
                                      console.warn("Blocked invalid URL:", d.url);
                                    }
                                  }}
                                >
                                  {d.name}
                                </span>
                              ) : (
                                <span title={d.reference || ""}>
                                  {d.name}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

              </div>
            )}

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

            {!readOnly && (
              <button onClick={() => setParticipantModalOpen(true)}>
                Confirm Participant
              </button>
            )}

            <button onClick={onClose}>
              Close
            </button>

          </div>

        </div>

        {participantModalOpen && !readOnly && (
          <SubordinateSelectionModal
            title="Confirm Escalation Participant"
            items={[]}
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
        <DocumentEntryModal
          open={docModalOpen}
          onClose={() => setDocModalOpen(false)}
          onConfirm={({ name, location }) => {
            createDocument({
              name,
              taskId,
              url: location,
              reference: escalation?.reference,
              addedBy: getActingUser(),
            });

            setRefreshTick((v) => v + 1);

            setDocModalOpen(false);
          }}
        />

      </div>

    </GovernanceSurfaceContainer>
  );
}
