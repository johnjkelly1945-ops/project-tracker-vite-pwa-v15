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

const ARTEFACT_STORAGE_KEY = "metra_governance_artefacts"

function loadArtefacts() {
  const raw = localStorage.getItem(ARTEFACT_STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const governanceArtefacts = loadArtefacts()

function saveArtefacts() {
  localStorage.setItem(ARTEFACT_STORAGE_KEY, JSON.stringify(governanceArtefacts))
}

let artefactCounter = governanceArtefacts.length + 1

function generateReference() {
  const ref = "RISK-" + String(artefactCounter).padStart(3, "0")
  artefactCounter++
  return ref
}

function reconcileRiskArtefactsFromEvents() {
  const raw = localStorage.getItem("metra_governance_events")
  if (!raw) return

  try {
    const parsed = JSON.parse(raw)
    const events =
      parsed && typeof parsed === "object"
        ? Object.values(parsed)
        : []

    const known = new Set(governanceArtefacts.map(a => a.artefactId))

    events
      .filter(event => event && event.eventType === "RISK" && event.artefactId)
      .forEach(event => {
        if (known.has(event.artefactId)) return

        governanceArtefacts.push({
          artefactId: event.artefactId,
          artefactType: "Risk",
          segmentId: null,
          taskId: event.taskId || null,
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
          createdBy: event.initiatedBy || "system",
          createdDate: new Date(event.initiatedAt || Date.now()).toISOString(),
          updatedDate: new Date(event.initiatedAt || Date.now()).toISOString()
        })

        known.add(event.artefactId)
      })

    saveArtefacts()
  } catch {
  }
}

// reconcileRiskArtefactsFromEvents()

export function createRiskArtefact(segmentId, taskId, taskTitleOrCreatedBy = "", createdBy = "system") {

  let taskTitle = "";
  if (typeof taskTitleOrCreatedBy === "string" && taskTitleOrCreatedBy.startsWith("task-")) {
    // old call pattern: (segmentId, taskId, createdBy)
    createdBy = taskTitleOrCreatedBy;
  } else {
    taskTitle = taskTitleOrCreatedBy || "";
  }

  const artefact = {
    artefactId: crypto.randomUUID(),
    artefactType: "Risk",

    segmentId,
    taskId,
    taskTitle: taskTitle || "",

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
  saveArtefacts()

  return artefact
}

export function updateRiskArtefact(artefactId, updates) {
  const artefact = governanceArtefacts.find(a => a.artefactId === artefactId)

  if (!artefact) return null

  Object.assign(artefact, updates)

  saveArtefacts()
  artefact.updatedDate = new Date().toISOString()

  return artefact
}

export function getRiskArtefacts() {
  return governanceArtefacts.filter(a => a.artefactType === "Risk")
}

export function getRiskArtefactById(id) {
  return governanceArtefacts.find(a => a.artefactId === id)
}

/*
=====================================================================
ARTEFACT RETRIEVAL UTILITIES
=====================================================================
Stage 372 — Register Support
=====================================================================
*/

export function getAllGovernanceArtefacts() {
  return [...governanceArtefacts]
}

export function getGovernanceArtefactsByType(type) {
  return governanceArtefacts.filter(
    artefact => artefact.artefactType.toLowerCase() === type.toLowerCase()
  )
}


/*
=====================================================================
ISSUE ARTEFACT SUPPORT
Stage 378 — Governance Artefact Generalisation
=====================================================================
*/

export function createIssueArtefact(segmentId, taskId, taskTitleOrCreatedBy = "", createdBy = "system") {
  const artefact = {
    artefactId: crypto.randomUUID(),
    artefactType: "Issue",

    segmentId,
    taskId,

    reference: "ISSUE-" + String(artefactCounter).padStart(3, "0"),
    title: "",
    description: "",
    owner: "",
    taskTitle: typeof taskTitleOrCreatedBy === "string" ? taskTitleOrCreatedBy : "",

    status: "Open",
    notes: "",

    createdBy,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }

    artefactCounter++
    governanceArtefacts.push(artefact)
    saveArtefacts()

  return artefact
}

export function updateIssueArtefact(artefactId, updates) {
  const artefact = governanceArtefacts.find(a => a.artefactId === artefactId)

  if (!artefact) return null

  Object.assign(artefact, updates)

  saveArtefacts()

  artefact.updatedDate = new Date().toISOString()

  return artefact
}

export function getIssueArtefacts() {
  return governanceArtefacts.filter(a => a.artefactType === "Issue")
}

export function getIssueArtefactById(id) {
  return governanceArtefacts.find(a => a.artefactId === id)
}

/*
=====================================================================
QC ARTEFACT SUPPORT
Stage 378 — Governance Artefact Generalisation
=====================================================================
*/

export function createQCArtefact(segmentId, taskId, taskTitleOrCreatedBy = "", createdBy = "system") {

  let taskTitle = "";
  let resolvedCreatedBy = createdBy;

  if (typeof taskTitleOrCreatedBy === "string" && taskTitleOrCreatedBy.startsWith("task-")) {
    resolvedCreatedBy = taskTitleOrCreatedBy;
  } else {
    taskTitle = taskTitleOrCreatedBy || "";
  }

  const artefact = {
    artefactId: crypto.randomUUID(),
    artefactType: "QC",

    segmentId,
    taskId,

    reference: "QC-" + String(artefactCounter).padStart(3, "0"),
    title: "",
    description: "",
    owner: "",
    taskTitle: taskTitle,

    status: "Open",
    notes: "",

    createdBy: resolvedCreatedBy,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }

  artefactCounter++
  governanceArtefacts.push(artefact)
  saveArtefacts()

  return artefact
}
export function updateQCArtefact(artefactId, updates) {
  const artefact = governanceArtefacts.find(a => a.artefactId === artefactId)

  if (!artefact) return null

  Object.assign(artefact, updates)

  saveArtefacts()

  artefact.updatedDate = new Date().toISOString()

  return artefact
}

export function getQCArtefacts() {
  return governanceArtefacts.filter(a => a.artefactType === "QC")
}

export function getQCArtefactById(id) {
  return governanceArtefacts.find(a => a.artefactId === id)
}

/*
=====================================================================
CHANGE CONTROL ARTEFACT SUPPORT
Stage 378 — Governance Artefact Generalisation
=====================================================================
*/

export function createChangeArtefact(segmentId, taskId, createdBy = "system") {
  const artefact = {
    artefactId: crypto.randomUUID(),
    artefactType: "Change",

    segmentId,
    taskId,

    reference: "CC-" + String(artefactCounter).padStart(3, "0"),
    title: "",
    description: "",
    owner: "",

    status: "Open",
    notes: "",

    createdBy,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  }

  artefactCounter++

  governanceArtefacts.push(artefact)

  saveArtefacts()
  return artefact
}

export function updateChangeArtefact(artefactId, updates) {
  const artefact = governanceArtefacts.find(a => a.artefactId === artefactId)

  if (!artefact) return null

  Object.assign(artefact, updates)

  artefact.updatedDate = new Date().toISOString()
  saveArtefacts()

  return artefact
}

export function getChangeArtefacts() {
  return governanceArtefacts.filter(a => a.artefactType === "Change")
}

export function getChangeArtefactById(id) {
  return governanceArtefacts.find(a => a.artefactId === id)
}
