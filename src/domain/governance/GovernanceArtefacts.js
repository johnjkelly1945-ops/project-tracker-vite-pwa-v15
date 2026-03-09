// @ts-nocheck
/*
=====================================================================
METRA — GovernanceArtefacts.js
Stage 371 — Governance Artefact Service Layer

PURPOSE
---------------------------------------------------------------------
Provide creation and update services for governance artefacts.

This layer:

• Generates artefact IDs
• Generates human-readable references
• Creates artefacts from governance events
• Updates artefact attributes
• Delegates persistence to GovernanceArtefactRepository

Does NOT:
• Enforce governance lifecycle logic
• Bind to UI
• Replace governance events

Artefacts represent structured governance outcomes derived
from governance events.

=====================================================================
*/

import {
  artefactCreate,
  artefactGet,
  artefactGetByTask,
  artefactGetByType,
  artefactUpdate,
} from "./GovernanceArtefactRepository";

/*
=====================================================================
UTILITY — ID GENERATION
=====================================================================
*/

function generateArtefactId(type) {
  return `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/*
=====================================================================
REFERENCE GENERATION
=====================================================================
*/

function generateReference(type) {
  const prefixMap = {
    risk: "RISK",
    issue: "ISSUE",
    qc: "QC",
    change: "CC",
  };

  const prefix = prefixMap[type] || "ART";

  const existing = artefactGetByType(type);
  const nextNumber = existing.length + 1;

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

/*
=====================================================================
CREATE ARTEFACT
=====================================================================
*/

export function createGovernanceArtefact({ type, eventId, taskId }) {
  const artefactId = generateArtefactId(type);

  const artefact = {
    artefactId,
    type,
    eventId,
    taskId,

    reference: generateReference(type),

    title: "",
    description: "",
    cause: "",
    impact: "",
    likelihood: "",
    severity: "",
    mitigation: "",
    owner: "",
    reviewDate: null,

    status: "OPEN",

    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return artefactCreate(artefact);
}

/*
=====================================================================
GET ARTEFACT
=====================================================================
*/

export function getGovernanceArtefact(artefactId) {
  return artefactGet(artefactId);
}

/*
=====================================================================
GET ARTEFACTS BY TASK
=====================================================================
*/

export function getArtefactsByTask(taskId) {
  return artefactGetByTask(taskId);
}

/*
=====================================================================
UPDATE ARTEFACT
=====================================================================
*/

export function updateGovernanceArtefact(artefactId, updates) {
  const artefact = artefactGet(artefactId);
  if (!artefact) return null;

  const updated = {
    ...artefact,
    ...updates,
    updatedAt: Date.now(),
  };

  return artefactUpdate(artefactId, updated);
}
