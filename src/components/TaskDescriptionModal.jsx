// @ts-nocheck
import { useEffect, useState } from "react";

/*
=====================================================================
METRA — TaskDescriptionModal.jsx
Stage 341 — Description Surface (Transaction Surface Aligned)
Stage 351 — On-Demand Template Activation (Append-Only)
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

Stage 351 Additive:
• Optional insertion of taskDescription templates.
• Insertion is append-only via onAddDescription.
• No linkage retention (text only).
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

  /* Stage 351 (Additive) */
  availableTemplates = [],
  openTemplatePickerOnOpen = false,
  onConsumedTemplateOpen,
}) {
  const [draftText, setDraftText] = useState("");
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  useEffect(() => {
    if (openTemplatePickerOnOpen) {
      setTemplatePickerOpen(true);
      if (typeof onConsumedTemplateOpen === "function") {
        onConsumedTemplateOpen();
      }
    }
  }, [openTemplatePickerOnOpen, onConsumedTemplateOpen]);

  function handleCommit() {
    const text = draftText.trim();
    if (!text) return;

    const stamped = `[${currentUserRole}] ${text} — ${nowStamp()}`;
    onAddDescription(taskId, stamped);
    setDraftText("");
  }

  function handleInsertTemplate(tpl) {
    if (!tpl || typeof tpl !== "object") return;

    const title = String(tpl.title || "Template").trim();
    const id = String(tpl.id || "").trim();
    const body = String(tpl.description || "").trim();

    if (!body) return;

    const headerId = id ? ` ${id} |` : "";
    const stamped =
      `[SYSTEM][TEMPLATE]${headerId} ${title} — ${nowStamp()}\n` + body;

    onAddDescription(taskId, stamped);
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
          <strong>DESCRIPTION</strong>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {Array.isArray(availableTemplates) && availableTemplates.length > 0 && (
              <button onClick={() => setTemplatePickerOpen((v) => !v)}>
                Templates
              </button>
            )}

            <button onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {templatePickerOpen && Array.isArray(availableTemplates) && availableTemplates.length > 0 && (
            <div
              style={{
                marginBottom: "16px",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "6px",
                padding: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Insert Template</strong>
                <button onClick={() => setTemplatePickerOpen(false)}>Close</button>
              </div>

              <div style={{ marginTop: "10px" }}>
                {availableTemplates.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 0",
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {t.id}
                      </div>
                    </div>
                    <button onClick={() => handleInsertTemplate(t)}>Insert</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entries.map((line, idx) => {
            const rawText =
              typeof line === "string"
                ? line
                : line && typeof line === "object" && typeof line.text === "string"
                  ? line.text
                  : "";

            const derivedTs =
              line && typeof line === "object" && typeof line.timestamp === "string"
                ? line.timestamp
                : "";

            const [text, tsFromString] = rawText.split(" — ");
            const ts = tsFromString || derivedTs;

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
