// @ts-nocheck
/*
=====================================================================
METRA — GovernanceArtefactRepository.js
Stage 371 — Governance Artefact Persistence (Phase 1)

PURPOSE
---------------------------------------------------------------------
Provide durable persistence for Governance Artefacts using localStorage.

This repository:

• Persists governance artefacts
• Maintains artefactId as primary key
• Supports artefact lookup by task and type
• Mirrors GovernanceRepository pattern

Does NOT:
• Enforce governance logic
• Mutate task lifecycle
• Bind to UI

Artefacts represent structured governance outcomes derived from
governance events.

=====================================================================
*/

const STORAGE_KEY = "metra_governance_artefacts";

/*
=====================================================================
LOAD
=====================================================================
*/

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/*
=====================================================================
SAVE
=====================================================================
*/

function save(artefacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artefacts));
}

/*
=====================================================================
REPOSITORY STATE
=====================================================================
*/

let artefacts = load();

/*
=====================================================================
CRUD OPERATIONS
=====================================================================
*/

export function artefactCreate(artefact) {
  artefacts[artefact.artefactId] = artefact;
  save(artefacts);
  return artefact;
}

export function artefactGet(artefactId) {
  return artefacts[artefactId] || null;
}

export function artefactGetByTask(taskId) {
  return Object.values(artefacts).filter(
    (artefact) => artefact.taskId === taskId
  );
}

export function artefactGetByType(type) {
  return Object.values(artefacts).filter(
    (artefact) => artefact.type === type
  );
}

export function artefactUpdate(artefactId, updatedArtefact) {
  if (!artefacts[artefactId]) return null;
  artefacts[artefactId] = updatedArtefact;
  save(artefacts);
  return artefacts[artefactId];
}

export function artefactReset() {
  artefacts = {};
  save(artefacts);
}
