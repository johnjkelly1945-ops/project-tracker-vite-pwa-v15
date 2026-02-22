// @ts-nocheck
import { useState } from "react";

/*
=====================================================================
METRA — TaskDescriptionModal.jsx
Stage 341 — Description Surface (Transaction Surface Aligned)
=====================================================================

Design Authority:
• Description entries are immutable once committed.
• Commit does NOT close modal.
• Close does NOT commit.
• Entries append chronologically (newest last).
• No edit.
• No delete.
• No lifecycle modelling.
• Transaction surface styling matches Notes (SEM-TS parity).
=====================================================================
*/

function nowStamp() {
  return new Date().toLocaleString();
}

export default function TaskDescriptionModal({
  taskId,
  entries = [],
  onAddDescription,
  onClose,
  currentUserRole = "PM",
}) {
  const [draftText, setDraftText] = useState("");

  function handleCommit() {
    const text = draftText.trim();
    if (!text) return;

    const stamped = `[${currentUserRole}] ${text} — ${nowStamp()}`;
    onAddDescription(taskId, stamped);
    setDraftText("");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 2000,
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
        {/* Header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>DESCRIPTION</strong>
          <button onClick={onClose}>Close</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {entries.map((line, idx) => {
            const [text, ts] = line.split(" — ");
            return (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>
                {ts && (
                  <span
                    style={{
                      marginLeft: "6px",
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    — {ts}
                  </span>
                )}
              </div>
            );
          })}

          {/* Transaction surface — visually integrated */}
          <div
            style={{
              marginTop: "16px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: "12px",
            }}
          >
            <textarea
              rows={3}
              style={{
                width: "100%",
                resize: "vertical",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
              placeholder="Enter description..."
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
            />

            <div style={{ textAlign: "right", marginTop: "6px" }}>
              <button onClick={handleCommit}>Commit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
