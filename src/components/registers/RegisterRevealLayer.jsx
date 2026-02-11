// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 307 — Lifecycle & Exposure Projection Implementation
(Governance-Only Restriction Applied)

PURPOSE
---------------------------------------------------------------------
Provide lifecycle (state) and exposure projection within the
existing harmonised Ledger layout for governance artefacts only,
without altering layout canon.
=====================================================================
*/

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let listenersAttached = false;

/* ------------------------------------------------------------------
   STATIC GOVERNANCE STUB (INSPECTION-ONLY)
------------------------------------------------------------------ */

const GOVERNANCE_CHANGE_STUB = [
  {
    title: "Scope boundary adjustment required",
    changeId: "CHANGE-001",
    createdBy: "J. Smith",
    createdOn: "2026-02-11",
    originatingTaskName: "Confirm delivery scope",
    taskId: "TASK-00121",
    closed: false,

    // Stage 307 extensions (governance artefacts only)
    state: "IDENTIFIED",
    severity: "High",
    category: "Operational",
  },
];

export default function RegisterRevealLayer() {
  const host = document.getElementById("metra-register-reveal");
  const [visible, setVisible] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [activeRegister, setActiveRegister] = useState(null);

  useEffect(() => {
    if (listenersAttached) return;
    listenersAttached = true;

    const onReveal = (e) => {
      if (!e?.detail?.register) return;
      setActiveRegister(e.detail.register);
      setVisible(true);
      setFilterText("");
    };

    const onClose = () => {
      setVisible(false);
      setFilterText("");
      setActiveRegister(null);
    };

    window.addEventListener("metra:register:reveal", onReveal);
    window.addEventListener("metra:register:close", onClose);
  }, []);

  if (!host || !visible || !activeRegister) return null;

  /* ------------------------------------------------------------------
     GOVERNANCE LEDGER CHECK
  ------------------------------------------------------------------ */

  const isGovernanceLedger =
    activeRegister === "change" ||
    activeRegister === "risks" ||
    activeRegister === "issues";

  /* ------------------------------------------------------------------
     HEADER MAPPING (Stage 305)
  ------------------------------------------------------------------ */

  const headerMap = {
    change: "Change Ledger",
    risks: "Risk Ledger",
    issues: "Issue Ledger",
    artefacts: "Artefact Ledger",
  };

  const headerLabel =
    headerMap[activeRegister] || "Governance Ledger";

  /* ------------------------------------------------------------------
     LIFECYCLE DOT STYLES (Stage 306 Canon)
  ------------------------------------------------------------------ */

  const dotBase = {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "8px",
    verticalAlign: "middle",
  };

  const dotColourMap = {
    IDENTIFIED: "#999999",
    ASSESSED: "#2b6cb0",
    MITIGATED: "#d69e2e",
    ACCEPTED: "#6b46c1",
    CLOSED: "#2f855a",
  };

  /* ------------------------------------------------------------------
     FILTERING (TEXT-BASED, SAFE FOR ALL LEDGERS)
  ------------------------------------------------------------------ */

  const tokens = filterText
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const filterByTokens = (fields) =>
    tokens.length === 0 ||
    tokens.every((tok) => fields.some((f) => f.includes(tok)));

  const rows = GOVERNANCE_CHANGE_STUB.filter((r) =>
    filterByTokens(
      [
        r.title,
        r.changeId,
        r.createdBy,
        r.originatingTaskName,
        r.taskId,
        r.category || "",
        r.severity || "",
        r.state || "",
      ].map((v) => String(v).toLowerCase())
    )
  );

  /* ------------------------------------------------------------------
     CANONICAL STYLES (UNCHANGED)
  ------------------------------------------------------------------ */

  const thStyle = {
    whiteSpace: "nowrap",
    textAlign: "left",
    padding: "8px 10px",
    background: "#f3f6fa",
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #d6d6d6",
  };

  const tdStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "6px 10px",
    borderRight: "1px solid #d6d6d6",
    verticalAlign: "middle",
  };

  const idStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#666",
    marginLeft: "6px",
  };

  /* ------------------------------------------------------------------
     CATEGORY + EXPOSURE RENDER (GOVERNANCE ONLY)
  ------------------------------------------------------------------ */

  const renderCategoryExposure = (r) => {
    if (!isGovernanceLedger) return "";

    const cat = r.category;
    const exp = r.severity;

    if (cat && exp) return `${cat} (${exp})`;
    if (exp && !cat) return `(${exp})`;
    if (cat && !exp) return cat;
    return "";
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
          background: "#fff",
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
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{headerLabel} — Governance (Read-Only)</strong>
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
            placeholder="Filter by title, task, actor, reference, date…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* Ledger */}
        <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "12.5%" }} />
              <col style={{ width: "12.5%" }} />
              <col style={{ width: "12.5%" }} />
              <col style={{ width: "12.5%" }} />
              <col />
            </colgroup>

            <thead>
              <tr>
                <th style={thStyle}>Record</th>
                <th style={thStyle}>Originating Task</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>By</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const categoryExposure = renderCategoryExposure(r);

                return (
                  <tr key={i} style={{ opacity: r.closed ? 0.5 : 1 }}>
                    <td style={tdStyle} title={r.title}>
                      {isGovernanceLedger && (
                        <span
                          style={{
                            ...dotBase,
                            backgroundColor:
                              dotColourMap[r.state] || "#999999",
                          }}
                        ></span>
                      )}
                      {r.title}
                    </td>

                    <td
                      style={tdStyle}
                      title={`${r.originatingTaskName} — ${r.taskId}`}
                    >
                      {r.originatingTaskName}
                      <span style={idStyle}>{r.taskId}</span>
                    </td>

                    <td
                      style={tdStyle}
                      title={categoryExposure}
                    >
                      {categoryExposure}
                    </td>

                    <td style={tdStyle} title={r.changeId}>
                      <span style={idStyle}>{r.changeId}</span>
                    </td>

                    <td style={tdStyle} title={r.createdBy}>
                      {r.createdBy}
                    </td>

                    <td style={tdStyle} title={r.createdOn}>
                      {r.createdOn}
                    </td>

                    <td style={tdStyle}></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    host
  );
}
