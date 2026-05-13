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

import { resolveOpenGovernanceCounts } from "../domain/governance/dashboardResolvers";

export default function GovernanceDashboard({ onClose }) {
  const openCounts = resolveOpenGovernanceCounts();
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
              <>
                <div
                  style={{
                    fontWeight: "700",
                    marginBottom: "18px",
                    color: "#444",
                    letterSpacing: "0.3px",
                  }}
                >
                  Status
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 220px",
                      border: "1px solid #e3dccf",
                      borderTop: "3px solid #b8aa8c",
                      borderRadius: "10px",
                      background: "#fcfbf8",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        marginBottom: "12px",
                        color: "#5e5545",
                      }}
                    >
                      Operational
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span>Issue</span>
                      <span>{openCounts.ISSUE}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Risk</span>
                      <span>{openCounts.RISK}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      flex: "1 1 220px",
                      border: "1px solid #d9e1e8",
                      borderTop: "3px solid #8ea3b5",
                      borderRadius: "10px",
                      background: "#fafbfd",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        marginBottom: "12px",
                        color: "#4f6272",
                      }}
                    >
                      Control
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span>QC</span>
                      <span>{openCounts.QC}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>CC</span>
                      <span>{openCounts.CC}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      flex: "1 1 220px",
                      border: "1px solid #e4dce2",
                      borderTop: "3px solid #a48a99",
                      borderRadius: "10px",
                      background: "#fcfafb",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        marginBottom: "12px",
                        color: "#6b5964",
                      }}
                    >
                      Escalation
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Escalation</span>
                      <span>{openCounts.ESCALATION}</span>
                    </div>
                  </div>
                </div>
              </>
          </div>
        </div>
      </div>
    </div>
  );
}
