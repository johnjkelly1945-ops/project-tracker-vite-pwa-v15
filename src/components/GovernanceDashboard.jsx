// @ts-nocheck

/*
=====================================================================
METRA — GovernanceDashboard.jsx
Stage 478C.1 — Governance Observability Surface Shell
=====================================================================

PURPOSE
---------------------------------------------------------------------
Establish Governance Dashboard as a consultative observability surface.

CANON
---------------------------------------------------------------------
• Dashboard = awareness orientation layer
• Dashboard = abstraction over governance visibility
• Dashboard = WHAT

Dashboard must remain:
• non-authoritative
• projection-only
• consultative
• observational

Dashboard must NOT:
• mutate governance
• execute governance
• prescribe workflow
• replace ledgers
• replace advisories

SEMANTIC MODEL
---------------------------------------------------------------------
Dashboard reveals.
Ledger anchors.
Advisory explains.
=====================================================================
*/

export default function GovernanceDashboard({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          maxWidth: "92vw",
          height: "700px",
          maxHeight: "90vh",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f7f7f7",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Governance Dashboard
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              Governance observability and awareness orientation surface
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #ccc",
              background: "#fff",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            padding: "28px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            color: "#333",
          }}
        >
          <div>
            <div style={{ fontWeight: "700", marginBottom: "8px" }}>
              Governance Observability Canon
            </div>

            <div style={{ lineHeight: 1.6 }}>
              Dashboard = WHAT<br />
              Ledger = WHERE<br />
              Advisory = WHY · HOW · WHO
            </div>
          </div>

          <div>
            <div style={{ fontWeight: "700", marginBottom: "8px" }}>
              Dashboard Doctrine
            </div>

            <div style={{ lineHeight: 1.6 }}>
              The dashboard provides awareness orientation only.<br />
              The dashboard guides attention but does not prescribe governance movement.<br />
              The dashboard simplifies governance visibility but never replaces governance reality.
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              border: "1px dashed #bbb",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            Future observability projections will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}
