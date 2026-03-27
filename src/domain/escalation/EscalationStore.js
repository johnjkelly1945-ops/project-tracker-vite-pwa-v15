// @ts-nocheck
/*
=====================================================================
METRA — EscalationStore.js
Stage 425 — Global Sequential Escalation Canon
=====================================================================
*/

const escalationStore = {
  byTask: {},
  all: []
};

function now() {
  return new Date().toISOString();
}

// ------------------------------------------------------------------
// GLOBAL REFERENCE (CANONICAL)
// ------------------------------------------------------------------

function nextReference() {
  const next = escalationStore.all.length + 1;
  return String(next).padStart(3, "0");
}

// ------------------------------------------------------------------
// CREATE ESCALATION
// ------------------------------------------------------------------

export function createEscalation({ taskId, title, classification = null }) {
  if (!taskId) throw new Error("createEscalation requires taskId");
  if (!title) throw new Error("createEscalation requires title");

  const reference = nextReference();

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
  escalationStore.all.push(escalation);

  return escalation;
}

// ------------------------------------------------------------------
// GET ESCALATIONS BY TASK
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
// GLOBAL LEDGER (FIXED)
// ------------------------------------------------------------------

export function getAllEscalations() {
  return escalationStore.all;
}

// ------------------------------------------------------------------
// APPEND ADVISORY
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
// DEBUG
// ------------------------------------------------------------------

export function __debug_getStore() {
  return escalationStore;
}
