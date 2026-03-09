/*
=====================================================================
METRA — GOVERNANCE MODULE
=====================================================================

Stage Introduced:
Stage 370 — Governance Module Foundation
Stage 371D — Register Surface using Artefact Repository

Purpose:
Container for governance artefact editing.

Layout:

Left Pane  → Risk Register
Right Pane → Risk Artefact Editor
=====================================================================
*/

import React, { useState } from "react"
import { artefactGetByType } from "../../domain/governance/GovernanceArtefactRepository"

export default function GovernanceModule() {

  const [selectedRiskId, setSelectedRiskId] = useState(null)

  const risks = artefactGetByType("risk")

  const selectedRisk = risks.find(r => r.artefactId === selectedRiskId)

  return (
    <div style={{ display: "flex", height: "100%" }}>

      {/* LEFT PANE — REGISTER */}
      <div
        style={{
          width: "40%",
          borderRight: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto"
        }}
      >
        <h3>Risk Register</h3>

        {risks.length === 0 && (
          <p>No risks recorded</p>
        )}

        {risks.map(risk => (
          <div
            key={risk.artefactId}
            style={{
              padding: "6px",
              cursor: "pointer",
              background:
                risk.artefactId === selectedRiskId ? "#eef" : "transparent"
            }}
            onClick={() => setSelectedRiskId(risk.artefactId)}
          >
            <strong>{risk.reference}</strong> — {risk.title || "(Untitled)"}
          </div>
        ))}

      </div>

      {/* RIGHT PANE — EDITOR */}
      <div
        style={{
          flex: 1,
          padding: "10px"
        }}
      >
        <h3>Risk Artefact</h3>

        {!selectedRisk && (
          <p>Select a risk to view or edit.</p>
        )}

        {selectedRisk && (
          <div>
            <p><strong>Reference:</strong> {selectedRisk.reference}</p>
            <p><strong>Title:</strong> {selectedRisk.title || "(Untitled)"}</p>
            <p><strong>Status:</strong> {selectedRisk.status}</p>
          </div>
        )}

      </div>

    </div>
  )
}
