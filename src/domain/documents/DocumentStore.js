// @ts-nocheck
/*
=====================================================================
METRA — DocumentStore (Stage 466 — Reference Registry)
Documents are external — METRA stores references only
=====================================================================
*/

const STORAGE_KEY = "metra_documents";

/* ============================================================
   INTERNAL HELPERS
============================================================ */

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("DocumentStore load error", e);
    return [];
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function generateId() {
  return "DOC-" + Math.random().toString(36).substr(2, 9);
}

function now() {
  return new Date().toISOString();
}

/* ============================================================
   VALIDATION
============================================================ */

function validateContext({ taskId, eventId, artefactId }) {
  const count =
    (taskId ? 1 : 0) +
    (eventId ? 1 : 0) +
    (artefactId ? 1 : 0);

  if (count !== 1) {
    throw new Error(
      "Document must have exactly one context: taskId OR eventId OR artefactId"
    );
  }
}

/* ============================================================
   API
============================================================ */

export function createDocument({
  name,
  url,
  taskId = null,
  eventId = null,
  artefactId = null,
  addedBy = "system",
}) {
  if (!name || !url) {
    throw new Error("Document requires name and url");
  }

  validateContext({ taskId, eventId, artefactId });

  const list = load();

  const doc = {
    id: generateId(),
    name,
    url,

    taskId,
    eventId,
    artefactId,

    addedAt: now(),
    addedBy,
  };

  list.push(doc);
  save(list);

  return doc;
}

export function getDocumentsByTask(taskId) {
  return load().filter((d) => d.taskId === taskId);
}

export function getDocumentsByEvent(eventId) {
  return load().filter((d) => d.eventId === eventId);
}

export function getDocumentsByArtefact(artefactId) {
  return load().filter((d) => d.artefactId === artefactId);
}

export function resolveDocuments({
  taskId = null,
  eventId = null,
  artefactId = null,
}) {
  const list = load();

  return list.filter((d) => {
    return (
      (taskId && d.taskId === taskId) ||
      (eventId && d.eventId === eventId) ||
      (artefactId && d.artefactId === artefactId)
    );
  });
}
