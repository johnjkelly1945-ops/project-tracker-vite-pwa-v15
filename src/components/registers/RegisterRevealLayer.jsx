// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 279 — Governance Registers — Global Reveal Layer (INERT)
Stage 280 — Governance Registers — Reveal Activation (INSPECTION-ONLY)
Stage 281-1 — Overlay Frame Expansion (STRUCTURE ONLY)
Stage 281-2A — Artefacts Governance Ledger (STATIC, INSPECTION-ONLY)
Stage 281-2C — Modal Header METRA Styling (UI-ONLY)
Stage 281-2D — Governance Ledger Filter (INSPECTION-ONLY)
Stage 281-2E — Visible Governance Identity (ARTEFACTS ONLY)
Stage 281-2G — Header Semantic Compression (UI-ONLY)
Stage 284A — Artefacts Register Layout Refinement (DESIGN-LOCKED)
Stage 284 — Governance Register Filtering (IMPLEMENTATION)

PURPOSE
---------------------------------------------------------------------
Provide a global, inspection-only governance register surface.

Filtering conforms to Stage 283 design-lock:
• Unified free-text entry
• Tokenised AND / intersection semantics
• Programme / Project filterable via text only
• No clickable context
=====================================================================
*/

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let listenersAttached = false;

/*
---------------------------------------------------------------------
STATIC GOVERNANCE STUB (INSPECTION-ONLY)
---------------------------------------------------------------------
*/
const GOVERNANCE_ARTEFACTS_STUB = [
  {
    type: "Document",
    title: "Project Charter v1",
    createdBy: "J. Smith",
    createdOn: "2026-02-02",

    originatingTaskName: "Define Project Scope",
    taskId: "TASK-00042",

    programmeId: "PRG-001",
    projectId: "PROJ-ACME-01",
  },
  {
    type: "Template",
    title: "Risk Register Template",
    createdBy: "PMO",
    createdOn: "2025-11-18",

    originatingTaskName: "Initial Governance Setup",
    taskId: "TASK-INIT-01",

    programmeId: "PRG-000",
    projectId: "PROJ-GOV-BASE",
  },
];

export default function RegisterRevealLayer() {
  const host = document.getElementById("metra-register-reveal");
  const [visible, setVisible] = useState(false);
  const [activeRegister, setActiveRegister] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (listenersAttached) return;
    listenersAttached = true;

    function onReveal(e) {
      if (!e?.detail?.register) return;
      setActiveRegister(e.detail.register);
      setVisible(true);
      setFilterText("");
    }

    function onClose() {
      setVisible(false);
      setActiveRegister(null);
      setFilterText("");
    }

    window.addEventListener("metra:register:reveal", onReveal);
    window.addEventListener("metra:register:close", onClose);

    return () => {
      // Intentionally retained in StrictMode
    };
  }, []);

  if (!host || !visible) return null;

  /*
  -------------------------------------------------------------------
  FILTERING — AND / INTERSECTION SEMANTICS (STAGE 283)
  -------------------------------------------------------------------
  */
  const tokens = filterText
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const filteredArtefacts = GOVERNANCE_ARTEFACTS_STUB.filter((a) => {
    if (tokens.length === 0) return true;

    const fields = [
      a.title,
      a.createdBy,
      a.originatingTaskName,
      a.programmeId,
      a.projectId,
      a.taskId,
      a.type,
    ]
      .filter(Boolean)
      .map((v) => v.toLowerCase());

    // AND semantics: every token must match at least one field
    return tokens.every((tok) =>
      fields.some((field) => field.includes(tok))
    );
  });

  const idStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#666",
    marginLeft: "6px",
    whiteSpace: "nowrap",
  };

  const truncateStyle = {
    maxWidth: "240px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-block",
    verticalAlign: "bottom",
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={() =>
        window.dispatchEvent(new CustomEvent("metra:register:close"))
      }
    >
      <div
        style={{
          background: "#ffffff",
          color: "#333",
          width: "80vw",
          maxWidth: "1200px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            flex: "0 0 auto",
            padding: "16px 20px",
            background: "#0b3a63",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong style={{ fontSize: "16px", fontWeight: 600 }}>
            Artefacts Register — Governance Ledger (Read-Only)
          </strong>

          <button
            type="button"
            aria-label="Close register"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("metra:register:close")
              )
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "22px",
              lineHeight: "1",
              color: "#ffffff",
            }}
          >
            ×
          </button>
        </div>

        {/* Filter */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <input
            type="text"
            placeholder="Filter by creator, task, programme, project, type…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              fontSize: "13px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Ledger Body */}
        <div
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {activeRegister === "artefacts" && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  <th align="left">Type</th>
                  <th align="left">Task</th>
                  <th align="left">Document</th>
                  <th align="left">By</th>
                  <th align="left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtefacts.map((a, idx) => (
                  <tr key={idx}>
                    <td>{a.type}</td>

                    <td>
                      <span
                        title={`${a.originatingTaskName} — ${a.taskId}`}
                        style={truncateStyle}
                      >
                        {a.originatingTaskName}
                      </span>
                      <span style={idStyle}>{a.taskId}</span>
                    </td>

                    <td>
                      <span title={a.title} style={truncateStyle}>
                        {a.title}
                      </span>
                    </td>

                    <td>{a.createdBy}</td>
                    <td>{a.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    host
  );
}
