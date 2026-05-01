// @ts-nocheck
/*
=====================================================================
METRA — GlobalEscalationLedgerModal.jsx
Stage 463 FIX — Escalation Canon Restored (Display Enhancement Only)
=====================================================================
*/

import { useState } from "react";
import EscalationModal from "./EscalationModal";
import { getAllEscalations } from "../domain/escalation/EscalationStore";

export default function GlobalEscalationLedgerModal({ onClose }) {

  const [activeEscalation, setActiveEscalation] = useState(null);

  const escalations = getAllEscalations();

  // ✅ SAFE ADD: task title resolver (no model change)
  const tasks = JSON.parse(localStorage.getItem("metra_tasks") || "[]");

  function resolveTaskTitle(taskId) {
    const t = tasks.find(t => t.id === taskId);
    return t?.title || taskId;
  }

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
                e.stopPropagation();
                setActiveEscalation(esc);
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {esc.reference} — {esc.title}
              </div>

              {/* ✅ FIX: show proper task title */}
              <div style={{ fontSize: "12px", color: "#555" }}>
                Task: {resolveTaskTitle(esc.taskId)}
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
          taskTitle={resolveTaskTitle(activeEscalation.taskId)}
          escalation={activeEscalation}
          readOnly={true}
          onClose={() => setActiveEscalation(null)}
        />
      )}

    </div>
  );
}
