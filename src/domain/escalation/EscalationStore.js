// @ts-nocheck
/*
=====================================================================
METRA — EscalationStore.js
Stage 421 — Escalation Ledger Introduction (Minimal Canonical Store)
=====================================================================

Purpose
---------------------------------------------------------------------
Provide a single-source, in-memory ledger for Escalation records.

Principles
---------------------------------------------------------------------
• Additive only (no impact on existing behaviour)
• No UI coupling
• No authority logic
• No lifecycle management
• Escalation domain only (strict separation from governance)

=====================================================================
*/

// ------------------------------------------------------------------
// INTERNAL STORE
// ------------------------------------------------------------------

const escalationStore = {
  byTask: {}
};

// ------------------------------------------------------------------
// UTIL — Timestamp
// ------------------------------------------------------------------

function now() {
  return new Date().toISOString();
}

// ------------------------------------------------------------------
// UTIL — Reference Generator (per-task sequential)
// ------------------------------------------------------------------

function nextReference(taskId) {
  const list = escalationStore.byTask[taskId] || [];
  const next = list.length + 1;
  return String(next).padStart(3, "0");
}

// ------------------------------------------------------------------
// CREATE ESCALATION
// ------------------------------------------------------------------

export function createEscalation({ taskId, title, classification = null }) {
  if (!taskId) throw new Error("createEscalation requires taskId");
  if (!title) throw new Error("createEscalation requires title");

  const reference = nextReference(taskId);

  const escalation = {
    reference,
    taskId,
    title,
    classification,
    createdAt: now(),
    advisoryRecords: []
  };

  if (!escalationStore.byTask[taskId]) {
    escalationStore.byTask[taskId] = [];
  }

  escalationStore.byTask[taskId].push(escalation);

  return escalation;
}

// ------------------------------------------------------------------
// GET ALL ESCALATIONS FOR TASK
// ------------------------------------------------------------------

export function getEscalationsByTask(taskId) {
  if (!taskId) return [];
  return escalationStore.byTask[taskId] || [];
}

// ------------------------------------------------------------------
// GET SINGLE ESCALATION
// ------------------------------------------------------------------

export function getEscalation(taskId, reference) {
  const list = escalationStore.byTask[taskId] || [];
  return list.find(e => e.reference === reference) || null;
}

// ------------------------------------------------------------------
// APPEND ADVISORY RECORD
// ------------------------------------------------------------------

export function appendEscalationAdvisory({
  taskId,
  reference,
  summary,
  classification = null,
  actor
}) {
  const escalation = getEscalation(taskId, reference);

  if (!escalation) {
    throw new Error("Escalation not found for advisory append");
  }

  const advisory = {
    advisoryId: `${reference}-${escalation.advisoryRecords.length + 1}`,
    summary,
    classification,
    actor,
    submittedAt: now()
  };

  escalation.advisoryRecords.push(advisory);

  return advisory;
}

// ------------------------------------------------------------------
// DEBUG (NON-CANONICAL — DO NOT USE IN UI)
// ------------------------------------------------------------------

export function __debug_getStore() {
  return escalationStore;
}
