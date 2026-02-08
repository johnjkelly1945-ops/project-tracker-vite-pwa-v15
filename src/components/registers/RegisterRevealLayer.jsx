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

PURPOSE
---------------------------------------------------------------------
Provide a global, inspection-only governance register surface.

Stage 281-2G compresses column headers to governance-standard
abbreviations to reduce visual density without loss of meaning.
=====================================================================
*/

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let listenersAttached = false;

/*
---------------------------------------------------------------------
STATIC GOVERNANCE STUB (INSPECTION-ONLY)
---------------------------------------------------------------------
This stub represents the canonical governance ledger shape.
Data wiring will occur in a future authorised stage.
*/
const GOVERNANCE_ARTEFACTS_STUB = [
  {
    type: "Document",
    title: "Project Charter v1",
    createdBy: "J. Smith",
    createdOn: "2026-02-02",
    originatingTask: "Define Project Scope",

    programmeId: "PRG-001",
    projectId: "PROJ-ACME-01",
    taskId: "TASK-00042",
  },
  {
    type: "Template",
    title: "Risk Register Template",
    createdBy: "PMO",
    createdOn: "2025-11-18",
    originatingTask: "Initial Governance Setup",

    programmeId: "PRG-000",
    projectId: "PROJ-GOV-BASE",
    taskId: "TASK-INIT-01",
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

  const filteredArtefacts = GOVERNANCE_ARTEFACTS_STUB.filter((a) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.createdBy.toLowerCase().includes(q) ||
      a.originatingTask.toLowerCase().includes(q) ||
      a.programmeId.toLowerCase().includes(q) ||
      a.projectId.toLowerCase().includes(q) ||
      a.taskId.toLowerCase().includes(q)
    );
  });

  const idStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#666",
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
        {/* Header — METRA Royal Blue */}
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
            placeholder="Filter by identifier, creator, task, programme, or project…"
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
                  <th align="left">ID</th>
                  <th align="left">Title</th>
                  <th align="left">By</th>
                  <th align="left">Date</th>
                  <th align="left">Prog / Proj / Task</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtefacts.map((a, idx) => (
                  <tr key={idx}>
                    <td>{a.type}</td>
                    <td style={idStyle}>{a.taskId}</td>
                    <td>{a.title}</td>
                    <td>{a.createdBy}</td>
                    <td>{a.createdOn}</td>
                    <td style={idStyle}>
                      {a.programmeId} / {a.projectId} / {a.taskId}
                    </td>
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
