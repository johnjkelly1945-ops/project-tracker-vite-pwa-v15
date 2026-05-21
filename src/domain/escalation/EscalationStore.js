// @ts-nocheck
/*
=====================================================================
METRA — EscalationStore.js
Stage 426 — Source Linkage (Additive Extension)
=====================================================================
*/

import {
  loadEscalations,
  appendEscalation,
  updateEscalation
} from "./EscalationRepository";


const escalationStore = {
  byTask: {},
  all: []
};

// ------------------------------------------------------------------
// INITIAL LOAD FROM REPOSITORY (Stage 464)
// ------------------------------------------------------------------

const persisted = loadEscalations();

if (persisted.length > 0) {
  escalationStore.all = persisted;

  escalationStore.byTask = {};

  persisted.forEach(e => {
    if (!escalationStore.byTask[e.taskId]) {
      escalationStore.byTask[e.taskId] = [];
    }
    escalationStore.byTask[e.taskId].push(e);
  });
}


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
// CREATE ESCALATION (EXTENDED)
// ------------------------------------------------------------------

export function createEscalation({
  taskId,
  title,
  classification = null,
  sourceType,
  sourceId,
  segmentId,
    visibilityScope = "INTERNAL"
  }) {
  if (!taskId) throw new Error("createEscalation requires taskId");
  if (!title) throw new Error("createEscalation requires title");

  const reference = nextReference();

  // Stage 426 — additive fallback (NON-BREAKING)
  const resolvedSourceType = sourceType || "TASK";
  const resolvedSourceId = sourceId || taskId;

  const escalation = {
    reference,
    taskId,
    title,
    classification,
    createdAt: now(),
    status: "OPEN",

    // NEW — Stage 426 (additive only)
      segmentId,
    sourceType: resolvedSourceType,
    sourceId: resolvedSourceId,
      visibilityScope,

    advisoryRecords: []
  };

  if (!escalationStore.byTask[taskId]) {
    escalationStore.byTask[taskId] = [];
  }

  escalationStore.byTask[taskId].push(escalation);
  escalationStore.all.push(escalation);
  appendEscalation(escalation);

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
// APPEND ADVISORY (UNCHANGED)
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

  const actorName =
    actor && actor.displayName ? actor.displayName : "Unknown";

  const stampedSummary =
    "[" + actorName + "] " + (summary || "");

  const advisory = {
    advisoryId: `${reference}-${escalation.advisoryRecords.length + 1}`,
    summary: stampedSummary,
    classification,
    actor,
    submittedAt: now()
  };

  escalation.advisoryRecords.push(advisory);
  updateEscalation(escalation);

  return advisory;
}

// ------------------------------------------------------------------
// UPDATE ESCALATION VISIBILITY SCOPE (STAGE 485E)
// ------------------------------------------------------------------

export function updateEscalationScope({
  taskId,
  reference,
  visibilityScope,
  actor
}) {
  const escalation = getEscalation(taskId, reference);

  if (!escalation) {
    throw new Error("Escalation not found");
  }

  const nextScope =
    visibilityScope === "EXTERNAL"
      ? "EXTERNAL"
      : "INTERNAL";

  const previousScope =
    escalation.visibilityScope || "INTERNAL";

  if (previousScope === nextScope) {
    return escalation;
  }

  escalation.visibilityScope = nextScope;

  updateEscalation(escalation);

  return escalation;
}

export function closeEscalation({ taskId, reference, closedBy = "PM" }) {
  const escalation = getEscalation(taskId, reference);

  if (!escalation) {
    throw new Error("Escalation not found");
  }

  if (escalation.status !== "OPEN") {
    return escalation;
  }

  escalation.status = "CLOSED";
  escalation.closedAt = now();
  escalation.closedBy = closedBy;

  return escalation;
}

// ------------------------------------------------------------------
// DEBUG
// ------------------------------------------------------------------

export function __debug_getStore() {
  return escalationStore;
}
