// @ts-nocheck

import { useState } from "react";

import {
  resolveDocuments,
  createDocument,
} from "../domain/documents/DocumentStore";

import DocumentEntryModal from "./DocumentEntryModal";

/*
=====================================================================
METRA — TaskDocumentsModal.jsx
Stage 475A — Operational Evidence Workspace (FIRST PASS)
=====================================================================

Design Authority:
• Operational evidence workspace for Task.
• Live projection over authoritative DocumentStore.
• Append-only evidence continuity.
• Read-only evidence entries.
• No edit.
• No delete.
• No overwrite.
• Latest-first operational projection.
• Scrollable lineage workspace.
• Immutable Task note continuity preserved externally.

FIRST PASS ONLY:
• Resolve Task documents.
• Render latest-first.
• Open links safely.
• Append new evidence.
• Re-render authoritative projection.

Deferred:
• provenance visualization
• contextual extraction
• Gov/Review/Esc alignment
• usage projection
=====================================================================
*/

export default function TaskDocumentsModal({
  open,
  onClose,
  task,
  onAddNote,
  actor,
}) {
  const [docEntryOpen, setDocEntryOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  void refreshTick;

  if (!open || !task) return null;

  const documents = [...resolveDocuments({ taskId: task.id })]
    .reverse();

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

  function systemLine(text) {
    return `[System] ${text} — ${nowStamp()}`;
  }

  function handleAddDocument({ name, location }) {
    createDocument({
      taskId: task.id,
      taskTitle: task.title,
      name,
      url: location,
      reference: location,
      addedBy: actor?.displayName || actor?.id || "system",
    });

    if (typeof onAddNote === "function") {
      onAddNote(
        task.id,
        systemLine(`Document linked: "${name}"\n${location}`)
      );
    }

    setRefreshTick((t) => t + 1);
    setDocEntryOpen(false);
  }

  function handleOpenDocument(d) {
    try {
      const raw =
        typeof d.url === "string" && d.url.trim() !== ""
          ? d.url.trim()
          : "";

      if (!raw) return;

      const finalUrl =
        raw.startsWith("http://") ||
        raw.startsWith("https://")
          ? raw
          : `https://${raw}`;

      new URL(finalUrl);

      window.open(finalUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Blocked invalid URL:", d?.url);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 2600,
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
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <strong>TASK DOCUMENTS</strong>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <button onClick={() => setDocEntryOpen(true)}>
              Add
            </button>

            <button onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {documents.length === 0 ? (
            <div style={{ color: "#666" }}>
              (no documents yet)
            </div>
          ) : (
            documents.map((d) => (
              <div
                key={d.id}
                style={{
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div>
                    {(typeof d.url === "string" &&
                      d.url.trim() !== "" &&
                      !d.url.startsWith("/") &&
                      !d.url.startsWith("'/") &&
                      (d.url.includes(".") ||
                        d.url.startsWith("http://") ||
                        d.url.startsWith("https://"))) ? (
                    <span
                      title={d.url}
                      style={{
                        color: "#0b3a66",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      onClick={() => handleOpenDocument(d)}
                    >
                      {d.name}
                    </span>
                  ) : (
                    <span
                      title={d.reference || ""}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {d.name}
                    </span>
                  )}
                </div>

                {d.reference && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "12px",
                      color: "#666",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {d.reference}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <DocumentEntryModal
        open={docEntryOpen}
        onClose={() => setDocEntryOpen(false)}
        onConfirm={handleAddDocument}
      />
    </div>
  );
}
