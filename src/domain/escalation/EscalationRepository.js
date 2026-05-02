// @ts-nocheck
/*
=====================================================================
METRA — EscalationRepository.js
Stage 464 — Escalation Persistence (Canonical)
=====================================================================

PURPOSE

Pure persistence layer for escalation.

✔ localStorage read/write
✔ no business logic
✔ no projection
✔ no mutation logic

=====================================================================
*/

const STORAGE_KEY = "metra_escalations";

// ------------------------------------------------------------------
// LOAD
// ------------------------------------------------------------------

export function loadEscalations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("EscalationRepository load failed");
    return [];
  }
}

// ------------------------------------------------------------------
// SAVE
// ------------------------------------------------------------------

export function saveEscalations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
  } catch (e) {
    console.warn("EscalationRepository save failed");
  }
}

// ------------------------------------------------------------------
// APPEND
// ------------------------------------------------------------------

export function appendEscalation(escalation) {
  const list = loadEscalations();
  list.push(escalation);
  saveEscalations(list);
}

// ------------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------------

export function updateEscalation(updated) {
  const list = loadEscalations();

  const next = list.map(e =>
    e.reference === updated.reference ? updated : e
  );

  saveEscalations(next);
}
