// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 279 — Governance Registers — Global Reveal Layer (INERT)
Stage 280 — Governance Registers — Reveal Activation (INSPECTION-ONLY)
Stage 281-2A — Artefacts Governance Ledger (REFERENCE)
Stage 284 — Governance Register Filtering (IMPLEMENTATION)
Stage 286 — Governance Risks Register (INSPECTION-ONLY)
Stage 286C — Corrective Layout & Artefacts Restoration (UI-ONLY)
Stage 290 — Governance Issues Register (INSPECTION-ONLY)
Stage 291 — Governance Change Register (INSPECTION-ONLY)

PURPOSE
---------------------------------------------------------------------
Provide a global, inspection-only governance register surface.

Governance registers:
• Record FACTS only
• Provide traceability
• Point to authoritative operational sources
• Do not present analysis
=====================================================================
*/

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let listenersAttached = false;

/* ------------------------------------------------------------------
   STATIC GOVERNANCE STUBS (INSPECTION-ONLY)
------------------------------------------------------------------ */

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
];

const GOVERNANCE_RISKS_STUB = [
  {
    severity: "High",
    title: "Supplier delivery uncertainty",
    riskId: "RISK-001",
    createdBy: "A. Patel",
    createdOn: "2026-02-06",
    originatingTaskName: "Confirm supplier milestones",
    taskId: "TASK-00087",
    programmeId: "PRG-001",
    projectId: "PROJ-ACME-01",
  },
];

const GOVERNANCE_ISSUES_STUB = [
  {
    issueId: "ISSUE-001",
    title: "Dependency definition unclear",
    createdBy: "M. Brown",
    createdOn: "2026-02-10",
    originatingTaskName: "Define integration boundaries",
    taskId: "TASK-00115",
    programmeId: "PRG-001",
    projectId: "PROJ-ACME-01",
  },
];

const GOVERNANCE_CHANGE_STUB = [
  {
    changeId: "CHANGE-001",
    title: "Scope boundary adjustment required",
    createdBy: "J. Smith",
    createdOn: "2026-02-11",
    originatingTaskName: "Confirm delivery scope",
    taskId: "TASK-00121",
    programmeId: "PRG-001",
    projectId: "PROJ-ACME-01",
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
  }, []);

  if (!host || !visible) return null;

  /* ------------------------------------------------------------------
     FILTERING — AND / INTERSECTION SEMANTICS (STAGE 284)
  ------------------------------------------------------------------ */

  const tokens = filterText
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const filterByTokens = (fields) =>
    tokens.length === 0 ||
    tokens.every((tok) => fields.some((f) => f.includes(tok)));

  const filteredArtefacts = GOVERNANCE_ARTEFACTS_STUB.filter((a) =>
    filterByTokens(
      [
        a.title,
        a.createdBy,
        a.originatingTaskName,
        a.taskId,
        a.programmeId,
        a.projectId,
        a.type,
      ].map((v) => v.toLowerCase())
    )
  );

  const filteredRisks = GOVERNANCE_RISKS_STUB.filter((r) =>
    filterByTokens(
      [
        r.title,
        r.riskId,
        r.severity,
        r.createdBy,
        r.originatingTaskName,
        r.taskId,
        r.programmeId,
        r.projectId,
      ].map((v) => v.toLowerCase())
    )
  );

  const filteredIssues = GOVERNANCE_ISSUES_STUB.filter((i) =>
    filterByTokens(
      [
        i.title,
        i.issueId,
        i.createdBy,
        i.originatingTaskName,
        i.taskId,
        i.programmeId,
        i.projectId,
      ].map((v) => v.toLowerCase())
    )
  );

  const filteredChanges = GOVERNANCE_CHANGE_STUB.filter((c) =>
    filterByTokens(
      [
        c.title,
        c.changeId,
        c.createdBy,
        c.originatingTaskName,
        c.taskId,
        c.programmeId,
        c.projectId,
      ].map((v) => v.toLowerCase())
    )
  );

  /* ------------------------------------------------------------------
     CANONICAL CELL STYLES
  ------------------------------------------------------------------ */

  const noWrapCell = {
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  const idStyle = {
    ...noWrapCell,
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#666",
  };

  const truncateStyle = {
    ...noWrapCell,
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-block",
  };

  const headerTitle =
    activeRegister === "artefacts"
      ? "Artefacts Register — Governance Ledger (Read-Only)"
      : activeRegister === "risks"
      ? "Risks Register — Governance Ledger (Read-Only)"
      : activeRegister === "issues"
      ? "Issues Register — Governance Ledger (Read-Only)"
      : "Change Register — Governance Ledger (Read-Only)";

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
          width: "80vw",
          maxWidth: "1200px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "#0b3a63",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{headerTitle}</strong>
          <button
            style={{ background: "none", border: "none", color: "#fff" }}
            onClick={() =>
              window.dispatchEvent(new CustomEvent("metra:register:close"))
            }
          >
            ×
          </button>
        </div>

        {/* Filter */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #ddd" }}>
          <input
            type="text"
            placeholder="Filter by creator, task, programme, project, severity, reference…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {activeRegister === "artefacts" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Task</th>
                  <th>Document</th>
                  <th>By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtefacts.map((a, i) => (
                  <tr key={i}>
                    <td>{a.type}</td>
                    <td>
                      <span title={`${a.originatingTaskName} — ${a.taskId}`} style={truncateStyle}>
                        {a.originatingTaskName}
                      </span>{" "}
                      <span style={idStyle}>{a.taskId}</span>
                    </td>
                    <td>{a.title}</td>
                    <td>{a.createdBy}</td>
                    <td>{a.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeRegister === "risks" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Task</th>
                  <th>Risk</th>
                  <th>Risk ID</th>
                  <th>By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((r, i) => (
                  <tr key={i}>
                    <td>{r.severity}</td>
                    <td>
                      <span title={`${r.originatingTaskName} — ${r.taskId}`} style={truncateStyle}>
                        {r.originatingTaskName}
                      </span>{" "}
                      <span style={idStyle}>{r.taskId}</span>
                    </td>
                    <td>{r.title}</td>
                    <td>{r.riskId}</td>
                    <td>{r.createdBy}</td>
                    <td>{r.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeRegister === "issues" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Issue</th>
                  <th>Issue ID</th>
                  <th>By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((i, idx) => (
                  <tr key={idx}>
                    <td>
                      <span title={`${i.originatingTaskName} — ${i.taskId}`} style={truncateStyle}>
                        {i.originatingTaskName}
                      </span>{" "}
                      <span style={idStyle}>{i.taskId}</span>
                    </td>
                    <td>{i.title}</td>
                    <td>{i.issueId}</td>
                    <td>{i.createdBy}</td>
                    <td>{i.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeRegister === "change" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Change</th>
                  <th>Task</th>
                  <th>Change ID</th>
                  <th>By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredChanges.map((c, i) => (
                  <tr key={i}>
                    <td>{c.title}</td>
                    <td>
                      <span title={`${c.originatingTaskName} — ${c.taskId}`} style={truncateStyle}>
                        {c.originatingTaskName}
                      </span>{" "}
                      <span style={idStyle}>{c.taskId}</span>
                    </td>
                    <td>{c.changeId}</td>
                    <td>{c.createdBy}</td>
                    <td>{c.createdOn}</td>
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
