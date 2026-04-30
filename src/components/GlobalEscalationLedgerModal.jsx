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
import { getGovernanceEventsByTask } from "../governance/governanceStore";

export default function GlobalEscalationLedgerModal({ onClose, tasks = [] }) {

  const [activeEscalation, setActiveEscalation] = useState(null);

  const storeEscalations = getAllEscalations();

  const governanceEscalations = [];

  (tasks || []).forEach(task => {
    const events = getGovernanceEventsByTask(task.id) || [];

    events
      .filter(e => e.escalated === true)
      .forEach(e => {
        governanceEscalations.push({
          reference: `ESC-${e.eventId}`,
          title: `${e.eventType} escalation`,
          taskId: task.id,
          taskTitle: task.title,
          advisoryRecords: e.advisoryRecords || [],
          sourceType: e.eventType,
          sourceId: e.eventId
        });
      });
  });

  const escalations = [
    ...storeEscalations,
    ...governanceEscalations
  ];

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
          height: "75vh",
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

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {escalations.length === 0 && (
            <div>No escalations recorded</div>
          )}

          {escalations.map((esc) => (
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
                {esc.reference} — {esc.title}
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                Task: {esc.taskId}
              </div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                Advisory count: {(esc.advisoryRecords || []).length}
              </div>
            </div>
          ))}

        </div>

        <div
          style={{
            padding: "10px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            textAlign: "right",
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
