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

export default function GlobalEscalationLedgerModal({ onClose, tasks = [], activeSegmentId }) {

  const [activeEscalation, setActiveEscalation] = useState(null);
  const [query, setQuery] = useState("");

  const escalations = getAllEscalations().filter(
    esc => esc.segmentId === activeSegmentId
  );

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
            {filteredEscalations.map((esc) => {


            return (
            <div
              key={esc.reference}
              style={{
                padding: "12px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();   // 🔴 CRITICAL FIX
                setActiveEscalation(esc);
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {`ESC-${String(esc.reference).padStart(3, "0")} — ${esc.title}`}
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                Task: {(tasks.find(t => t.id === esc.taskId)?.title) || esc.taskId}
              </div>
                <div style={{ fontSize: "11px", color: "#777" }}>
                  Source: {esc.sourceType || "TASK"}
                </div>
                  <div style={{ fontSize: "11px", color: "#777" }}>
                    Scope: {esc.visibilityScope || "INTERNAL"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#777" }}>
                    Status: {esc.status || "OPEN"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#777" }}>
                    Date: {esc.createdAt ? new Date(esc.createdAt).toLocaleDateString() : "—"}
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
          taskTitle={(tasks.find(t => t.id === activeEscalation.taskId)?.title) || activeEscalation.taskId}
          escalation={activeEscalation}
          readOnly={true}
          onClose={() => setActiveEscalation(null)}
        />
      )}

    </div>
  );
}
