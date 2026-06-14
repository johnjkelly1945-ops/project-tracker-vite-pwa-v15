import { getGovernanceEventsByTask } from "../../governance/governanceStore";
// @ts-nocheck
/*
=====================================================================
METRA — RegisterRevealLayer.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 313 — Governance Lifecycle Filtering

PURPOSE
---------------------------------------------------------------------
Introduce lifecycleClass-based filtering while preserving layout,
lifecycle canon, tooltip transparency, and projection invariants.
=====================================================================
*/

import { useEffect, useState } from "react";
import { getRiskArtefacts, getIssueArtefacts, getQCArtefacts, getChangeArtefacts } from "../../domain/governance/GovernanceStore";
import { createPortal } from "react-dom";
import { getAllDocuments } from "../../domain/documents/DocumentStore";
import { loadWorkspace } from "../../storage/workspaceRepository";


let listenersAttached = false;

/* ------------------------------------------------------------------
   STUB DATA (Projection Only)
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
    state: "IDENTIFIED",
    severity: "High",
    category: "Operational",
  },
];

const GOVERNANCE_RISK_STUB = [
  {
    title: "Supplier insolvency exposure",
    changeId: "RISK-004",
    createdBy: "A. Patel",
    createdOn: "2026-02-09",
    originatingTaskName: "Validate supplier stability",
    taskId: "TASK-00087",
    closed: false,
    state: "ASSESSED",
    severity: "Critical",
    category: "Financial",
  },
];

const GOVERNANCE_ISSUE_STUB = [
  {
    title: "Delivery milestone missed",
    changeId: "ISSUE-011",
    createdBy: "M. Green",
    createdOn: "2026-02-08",
    originatingTaskName: "Track milestone completion",
    taskId: "TASK-00065",
    closed: false,
    state: "MITIGATED",
    severity: "Medium",
    category: "Schedule",
  },
];

const GOVERNANCE_QC_STUB = [
  {
    title: "Inspection non-conformance detected",
    changeId: "QC-003",
    createdBy: "R. Lewis",
    createdOn: "2026-02-12",
    originatingTaskName: "Perform quality inspection",
    taskId: "TASK-00132",
    closed: false,
    state: "FAILED",
    severity: "High",
    category: "Compliance",
  },
];

const ARTEFACT_EVENT_STUB = [
  {
    title: "Contract Amendment v2",
    changeId: "DOC-017",
    createdBy: "J. Smith",
    createdOn: "2026-02-10",
    originatingTaskName: "Upload amended contract",
    taskId: "TASK-00105",
    closed: false,
  },
];

export default function RegisterRevealLayer() {
  const host = document.getElementById("metra-register-reveal");
  const [visible, setVisible] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("ALL");
  const [activeRegister, setActiveRegister] = useState(null);

  const [activeSegmentId, setActiveSegmentId] = useState(null);
  useEffect(() => {
    if (listenersAttached) return;
    listenersAttached = true;

    const onReveal = (e) => {
      if (!e?.detail?.register) return;
      setActiveRegister(e.detail.register);
      setActiveSegmentId(e.detail.segmentId || null);
      setVisible(true);
      setFilterText("");
      setLifecycleFilter("ALL");
    };

    const onClose = () => {
      setVisible(false);
      setFilterText("");
      setLifecycleFilter("ALL");
      setActiveRegister(null);
      setActiveSegmentId(null);
    };

    window.addEventListener("metra:register:reveal", onReveal);
    window.addEventListener("metra:register:close", onClose);
  }, []);

  if (!host || !visible || !activeRegister) return null;

  const isGovernanceLedger =
    activeRegister === "change" ||
    activeRegister === "risks" ||
    activeRegister === "issues" ||
    activeRegister === "qc";

  const ledgerSourceMap = {
    change: GOVERNANCE_CHANGE_STUB,
    risks: GOVERNANCE_RISK_STUB,
    issues: GOVERNANCE_ISSUE_STUB,
    qc: GOVERNANCE_QC_STUB,
    artefacts: ARTEFACT_EVENT_STUB,
  };

  console.log("ACTIVE REGISTER:", activeRegister);
  console.log("ACTIVE SEGMENT:", activeSegmentId);

  /* ===============================
     STAGE 471 — DOCUMENT PROJECTION
     =============================== */

  const documentRows = getAllDocuments()
    .filter(d => d.segmentId === activeSegmentId)
    .map((d) => ({
    title: d.name || "Untitled Document",
    changeId: d.reference || "DOC",
    createdBy:
      typeof d.addedBy === "object"
        ? d.addedBy.displayName || d.addedBy.id || "—"
        : d.addedBy || "—",
      createdOn: d.addedAt || "—",
      originatingTaskName: d.taskTitle || d.taskId || "—",
    taskId: d.taskId || "—",
    closed: false,
    state: "DOCUMENT",
    severity: "",
      category: "DOCUMENT",
    url: d.url || null,
  }));

  const workspace = loadWorkspace() || {};

  const reminderRows = [
    ...(workspace.dev?.tasks || []),
    ...(workspace.mgmt?.tasks || []),
  ]
    .filter(
      (t) =>
        t.segmentId === activeSegmentId &&
        t.reminderDate
    )
    .sort(
      (a, b) =>
        String(a.reminderDate).localeCompare(
          String(b.reminderDate)
        )
    )
    .map((t) => ({
      title: t.reminderContext || "Reminder",
      changeId: t.reminderDate,
      createdBy: t.reminderCreatedBy || "—",
      createdOn: t.reminderCreatedAt || "—",
      originatingTaskName: t.title || "Untitled Task",
      taskId: t.id,
      closed: false,
      state: "REMINDER",
      severity: "",
      category: "REMINDER",
    }));

  const segments = workspace.segments || [];

  const archivedSegmentMap = new Map(
    segments
      .filter(s => s.archived)
      .map(s => [
        s.segmentId,
        s.segmentTitle || "Untitled Segment"
      ])
  );

  const archiveReminderRows = [
    ...(workspace.dev?.tasks || []),
    ...(workspace.mgmt?.tasks || []),
  ]
    .filter(
      (t) =>
        t.reminderDate &&
        archivedSegmentMap.has(t.segmentId)
    )
    .sort(
      (a, b) =>
        String(a.reminderDate).localeCompare(
          String(b.reminderDate)
        )
    )
    .map((t) => ({
        title:
          "[" +
          archivedSegmentMap.get(t.segmentId) +
          "] " +
          (t.reminderContext || "Reminder"),
      changeId: t.reminderDate,
      createdBy: t.reminderCreatedBy || "—",
      createdOn: t.reminderCreatedAt || "—",
      originatingTaskName:
        t.title || "Untitled Task",
      taskId: t.id,
      closed: false,
      state: "REMINDER",
      severity: "",
      category: "REMINDER",
    }));



  let source = [];

    if (activeRegister === "risks" || activeRegister === "risk") {
      source = getRiskArtefacts().filter(a => a.segmentId === activeSegmentId).map(a => {
        const events = getGovernanceEventsByTask(a.taskId)
          .filter(e => e.artefactId === a.artefactId);

        const latest = events[events.length - 1];
        const status = latest?.status || "OPEN";

        return {
          title: a.title || "Untitled",
          changeId: a.reference,
          createdBy: a.createdBy || "—",
          createdOn: a.createdDate || "—",
          originatingTaskName: a.taskTitle || a.taskId,
          taskId: a.taskId,
          closed: status === "CLOSED",
          state: status,
          severity: "",
          category: a.category || "",
        };
      });
  } else if (activeRegister === "issues" || activeRegister === "issue") {
    source = getIssueArtefacts().filter(a => a.segmentId === activeSegmentId).map(a => ({
      title: a.title || "Untitled",
      changeId: a.reference,
      createdBy: a.createdBy || "—",
      createdOn: a.createdDate || "—",
      originatingTaskName: a.taskTitle || a.taskId,
      taskId: a.taskId,
      closed: a.status === "Closed",
      state: a.status || "Open",
      severity: "",
      category: "",
    }));
  } else if (activeRegister === "qc") {
    source = getQCArtefacts().filter(a => a.segmentId === activeSegmentId).map(a => ({
      title: a.title || "Untitled",
      changeId: a.reference,
      createdBy: a.createdBy || "—",
      createdOn: a.createdDate || "—",
        originatingTaskName: a.taskTitle || a.taskId,
      taskId: a.taskId,
      closed: a.status === "Closed",
      state: a.status || "Open",
      severity: "",
      category: "",
    }));
  } else if (activeRegister === "change") {
    source = getChangeArtefacts().filter(a => a.segmentId === activeSegmentId).map(a => ({
      title: a.title || "Untitled",
      changeId: a.reference,
      createdBy: a.createdBy || "—",
      createdOn: a.createdDate || "—",
        originatingTaskName: a.taskTitle || a.taskId,
      taskId: a.taskId,
      closed: a.status === "Closed",
      state: a.status || "Open",
      severity: "",
      category: "",
      }));
    } else if (activeRegister === "artefacts") {
      source = documentRows;
      } else if (activeRegister === "reminders") {
        source = reminderRows;
      } else if (activeRegister === "archiveReminders") {
        source = archiveReminderRows;
    } else {
      source = ledgerSourceMap[activeRegister] || [];
    }

  const headerMap = {
    risks: "Risk Ledger",
    issues: "Issue Ledger",
    qc: "Quality Control Ledger",
      reminders: "Reminder Register",
      archiveReminders: "Archive Reminder Register",
      artefacts: "Document Register",
  };

  const headerLabel =
    headerMap[activeRegister] || "Governance Ledger";

  const deriveLifecycleClass = (state) => {
    switch (state) {
      case "IDENTIFIED":
        return "OPEN";
      case "ASSESSED":
      case "ACCEPTED":
      case "MITIGATED":
      case "FAILED":
        return "ACTIVE";
      case "VERIFIED":
      case "PASSED":
        return "RESOLVED";
      case "CLOSED":
        return "CLOSED";
      default:
        return "OPEN";
    }
  };

  const lifecycleColourMap = {
    OPEN: "#999999",
    ACTIVE: "#2b6cb0",
    RESOLVED: "#d69e2e",
    CLOSED: "#2f855a",
  };

  const tokens = filterText
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const filterByTokens = (fields) =>
    tokens.length === 0 ||
    tokens.every((tok) => fields.some((f) => f.includes(tok)));

  const rows = source.filter((r) => {
    const lifecycleClass = r.state
      ? deriveLifecycleClass(r.state)
      : null;

    const lifecycleMatch =
      lifecycleFilter === "ALL" ||
      lifecycleClass === lifecycleFilter;

    const tokenMatch = filterByTokens(
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
    );

    return lifecycleMatch && tokenMatch;
  });

  const dotBase = {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "8px",
    verticalAlign: "middle",
  };

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

  const formatReminderDate = (value) => {
    if (!value || value === "—") return "—";

    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return value;

    const [, year, month, day] = match;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
  };

  const idStyle = {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#666",
    marginLeft: "6px",
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
        <div
          style={{
            padding: "16px 20px",
            background: "#0b3a63",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
            <strong>{headerLabel}</strong>
          <button
            style={{ background: "none", border: "none", color: "#fff" }}
            onClick={() =>
              window.dispatchEvent(new CustomEvent("metra:register:close"))
            }
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            gap: "12px",
          }}
        >
          {isGovernanceLedger && (
            <select
              value={lifecycleFilter}
              onChange={(e) => setLifecycleFilter(e.target.value)}
              style={{ padding: "8px" }}
            >
              <option value="ALL">All</option>
              <option value="OPEN">OPEN</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          )}

          <input
            type="text"
            placeholder={activeRegister === "reminders" ? "Filter by reminder, task, creator or date…" : "Filter by title, task, actor, reference, date…"}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
        </div>

        <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          {(activeRegister === "reminders" || activeRegister === "archiveReminders") ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "18%" }} />
                <col style={{ width: "27%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: "center" }}>Reminder Date</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Reminder</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Task</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle}>Created</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    style={{ cursor: "pointer", opacity: r.closed ? 0.5 : 1 }}
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("metra:register:close")
                      );

                      window.dispatchEvent(
                        new CustomEvent("METRA_INTENT", {
                          detail: {
                            type: "OPEN_TASK_FROM_REMINDER_REGISTER",
                            payload: {
                              taskId: r.taskId,
                            },
                          },
                        })
                      );
                    }}
                  >
                    <td style={tdStyle} title={r.changeId}>
                      {formatReminderDate(r.changeId)}
                    </td>

                    <td style={tdStyle} title={r.title}>
                      {r.title}
                    </td>

                    <td style={tdStyle} title={r.originatingTaskName}>
                      {r.originatingTaskName}
                    </td>

                    <td style={tdStyle} title={r.createdBy}>
                      {r.createdBy}
                    </td>

                    <td style={tdStyle} title={r.createdOn}>
                      {r.createdOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
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
                  <th style={thStyle}>
                    {activeRegister === "reminders" ? "Reminder" : "Record"}
                  </th>

                  <th style={thStyle}>
                    {activeRegister === "reminders" ? "Task" : "Origin"}
                  </th>

                  <th style={thStyle}>
                    {activeRegister === "reminders" ? "Reminder Date" : "Reference"}
                  </th>

                  <th style={thStyle}>Status</th>

                  <th style={thStyle}>
                    {activeRegister === "reminders" ? "Created By" : "By"}
                  </th>

                  <th style={thStyle}>
                    {activeRegister === "reminders" ? "Created" : "Date"}
                  </th>
                </tr>
              </thead>

            <tbody>
              {rows.map((r, i) => {
                const lifecycleClass = r.state
                  ? deriveLifecycleClass(r.state)
                  : null;

                return (
                    <tr
                      key={i}
                      style={{
                        cursor:
                          r.category === "DOCUMENT"
                            ? "default"
                            : "pointer",
                        opacity: r.closed ? 0.5 : 1,
                      }}
                      onClick={() => {
                        if (r.category === "REMINDER") {

                          window.dispatchEvent(
                            new CustomEvent("metra:register:close")
                          );

                          window.dispatchEvent(
                            new CustomEvent("METRA_INTENT", {
                              detail: {
                                type: "OPEN_TASK_FROM_REMINDER_REGISTER",
                                payload: {
                                  taskId: r.taskId,
                                },
                              },
                            })
                          );

                          return;
                        }

                        if (r.category !== "DOCUMENT") {
                          window.dispatchEvent(
                            new CustomEvent("METRA_INTENT", {
                              detail: {
                                type: "OPEN_REGISTER_ITEM_VIEW",
                                payload: r,
                              },
                            })
                          );
                        }
                      }}
                      >
                    <td style={tdStyle} title={r.title}>
                      {isGovernanceLedger && lifecycleClass && (
                        <span
                          title={`${lifecycleClass} — ${r.state}`}
                          style={{
                            ...dotBase,
                            backgroundColor:
                              lifecycleColourMap[lifecycleClass] ||
                              "#999999",
                          }}
                        ></span>
                      )}
                        {(r.category === "DOCUMENT" && typeof r.url === "string" && r.url.trim() !== "" && !r.url.startsWith("/") && !r.url.startsWith("'/") && (r.url.includes(".") || r.url.startsWith("http://") || r.url.startsWith("https://"))) ? (<span title={r.url} style={{ color: "#0b3a66", textDecoration: "underline", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); try { const raw = r.url.trim(); const finalUrl = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`; new URL(finalUrl); window.open(finalUrl, "_blank", "noopener,noreferrer"); } catch (err) { console.warn("Blocked invalid URL:", r.url); } }}>{r.title}</span>) : (r.title)}
                    </td>

                      <td style={tdStyle} title={r.originatingTaskName}>
                        {r.originatingTaskName}
                      </td>

                    <td style={tdStyle} title={r.changeId}>
                      <span style={idStyle}>{r.changeId}</span>
                    </td>
                      <td style={tdStyle} title={r.state}>{r.state || "—"}</td>

                    <td style={tdStyle} title={r.createdBy}>
                      {r.createdBy}
                    </td>

                    <td style={tdStyle} title={r.createdOn}>
                      {r.createdOn}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>,
    host
  );
}
