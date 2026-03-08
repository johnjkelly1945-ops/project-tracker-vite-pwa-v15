/*
=====================================================================
METRA — GOVERNANCE STORE
=====================================================================

Purpose:
Global container for governance artefacts.

Stage Introduced:
Stage 370 — Governance Module Foundation

Rules:

• Artefacts originate from Tasks
• Ledger records events only
• Sidebar remains reveal-only
• Artefacts reference segmentId and taskId

=====================================================================
*/

const governanceArtefacts = []

let artefactCounter = 1

function generateReference() {
  const ref = "RISK-" + String(artefactCounter).padStart(3, "0")
  artefactCounter++
  return ref
}

export function createRiskArtefact(segmentId, taskId, createdBy = "system") {
  const artefact = {
    artefactId: crypto.randomUUID(),
    artefactType: "Risk",

    segmentId,
    taskId,

    reference: generateReference(),
    title: "",
    category: "",

    probability: "",
    impact: "",
    mitigation: "",
    owner: "",

    status: "Open",
    reviewDate: "",
    notes: "",

    createdBy,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }

  governanceArtefacts.push(artefact)

  return artefact
}

export function updateRiskArtefact(artefactId, updates) {
  const artefact = governanceArtefacts.find(a => a.artefactId === artefactId)

  if (!artefact) return null

  Object.assign(artefact, updates)

  artefact.updatedDate = new Date().toISOString()

  return artefact
}

export function getRiskArtefacts() {
  return governanceArtefacts.filter(a => a.artefactType === "Risk")
}

export function getRiskArtefactById(id) {
  return governanceArtefacts.find(a => a.artefactId === id)
}
