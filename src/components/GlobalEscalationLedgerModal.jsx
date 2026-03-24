// @ts-nocheck
/*
=====================================================================
METRA — GlobalEscalationLedgerModal.jsx
Stage 423 — Phase 2 Global Ledger Shell
=====================================================================
*/

import GovernanceSurfaceContainer from "./GovernanceSurfaceContainer";

export default function GlobalEscalationLedgerModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <GovernanceSurfaceContainer>

        <div
          style={{
            padding: "12px",
            background: "#fff",
            minWidth: "420px"
          }}
        >

          {/* Identity */}

          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Global Escalation Ledger
          </div>

          {/* Placeholder */}

          <div style={{ fontSize: "13px", opacity: 0.7 }}>
            (Global escalation ledger — data binding in next phase)
          </div>

          {/* Footer */}

          <div style={{ marginTop: "12px" }}>
            <button onClick={onClose}>Back</button>
          </div>

        </div>

      </GovernanceSurfaceContainer>

    </div>
  );
}
