// @ts-nocheck
/*
=====================================================================
METRA — GlobalEscalationLedgerModal.jsx
Stage 423 — Global Escalation Ledger (Cross-Task Visibility)
=====================================================================
*/

import { useState } from "react";
import EscalationModal from "./EscalationModal";
import { getAllEscalations } from "../domain/escalation/EscalationStore";

export default function GlobalEscalationLedgerModal({ onClose, tasks = [] }) {

  const [activeEscalation, setActiveEscalation] = useState(null);
  const [query, setQuery] = useState("");

  const escalations = getAllEscalations();

  const filteredEscalations = escalations.filter((esc) => {
    const q = query.toLowerCase();

    const taskTitle =
      (tasks.find(t => t.id === esc.taskId)?.title) || "";

    return (
      esc.title?.toLowerCase().includes(q) ||
      esc.reference?.toString().includes(q) ||
      esc.sourceType?.toLowerCase().includes(q) ||
      esc.classification?.toLowerCase().includes(q) ||
      taskTitle.toLowerCase().includes(q)
    );
  });



  /* =========================
     STAGE 471 — DOCUMENT PROJECTION (READ-ONLY)
  ========================= */

  const allDocuments = resolveDocuments({});

  const documentRows = allDocuments.map((doc) => {
    let category = "DOCUMENT (TASK)";

    if (doc.eventId) {
      category = "DOCUMENT (GOV)";
    } else if (doc.artefactId) {
      category = "DOCUMENT (ARTEFACT)";
    }

    return {
      type: "DOCUMENT",
      category,
      name: doc.name,
      reference: doc.reference,
      taskId: doc.taskId || "-",
      taskTitle: (tasks.find(t => t.id === doc.taskId)?.title) || doc.taskId || "-",
      addedBy: doc.addedBy,
      createdAt: doc.addedAt,
      url: doc.url,
    };
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 2500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          background: "#fff",
          width: "80%",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >

        <div
          style={{
            padding: "15px 20px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            fontWeight: 600,
          }}
        >
          Global Escalation Ledger
        </div>


        <div style={{ padding: "10px 20px" }}>
          <input
            type="text"
            placeholder="Search escalations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {escalations.length === 0 && (
            <div>No escalations recorded</div>
          )}
            {[...filteredEscalations, ...documentRows].map((item) => {


            return (
            <div
                key={item.reference || item.name}
              style={{
                padding: "12px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();   // 🔴 CRITICAL FIX
                  item.type !== "DOCUMENT" && setActiveEscalation(item);
              }}
            >
              <div style={{ fontWeight: 600 }}>
                  {item.type === "DOCUMENT"
                    ? `DOC — ${item.name}`
                    : `ESC-${String(item.reference).padStart(3, "0")} — ${item.title}`}
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                  Task: {item.taskTitle || "-"}
              </div>
                <div style={{ fontSize: "11px", color: "#777" }}>
                    Source: {item.type === "DOCUMENT" ? "DOCUMENT" : (item.sourceType || "TASK")}
                </div>
                <div style={{ fontSize: "11px", color: "#777" }}>
                    Category: {item.type === "DOCUMENT" ? "DOCUMENT" : (item.classification || "—")}
                </div>
                <div style={{ fontSize: "11px", color: "#777" }}>
                    Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                </div>
            </div>
            );
          })}

        </div>

        <div
          style={{
            padding: "10px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <button onClick={onClose}>Close</button>
        </div>

      </div>

      {activeEscalation && (
        <EscalationModal
          taskId={activeEscalation.taskId}
          taskTitle={activeEscalation.taskTitle}
          escalation={activeEscalation}
          readOnly={true}
          onClose={() => setActiveEscalation(null)}
        />
      )}

    </div>
  );
}
