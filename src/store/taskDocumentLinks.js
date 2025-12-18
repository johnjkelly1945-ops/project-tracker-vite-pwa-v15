/* ======================================================================
   METRA – Stage 11.1
   Task ↔ Document Association Store (Data Layer Only)
   ----------------------------------------------------------------------
   PURPOSE:
   • Persist non-destructive associations between Tasks and Documents
   • Population-route agnostic (UI, import, template, bulk, script)
   • No Summary awareness
   • No UI coupling
   • No document mutation

   CANONICAL RULE:
   Documents are called from Tasks only.
   Summaries have no relationship to documents.

   STORAGE KEY:
   metra.taskDocumentLinks.v1
   ====================================================================== */

const STORAGE_KEY = "metra.taskDocumentLinks.v1";

/* ----------------------------------------------------------------------
   Internal State
   ---------------------------------------------------------------------- */
let taskDocumentLinks = {};

/* ----------------------------------------------------------------------
   Safe Load
   ---------------------------------------------------------------------- */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      taskDocumentLinks = {};
      return;
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      taskDocumentLinks = parsed;
    } else {
      taskDocumentLinks = {};
    }
  } catch (err) {
    console.warn("METRA: Failed to load taskDocumentLinks, resetting.", err);
    taskDocumentLinks = {};
  }
}

/* ----------------------------------------------------------------------
   Safe Save
   ---------------------------------------------------------------------- */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskDocumentLinks));
  } catch (err) {
    console.warn("METRA: Failed to save taskDocumentLinks.", err);
  }
}

/* ----------------------------------------------------------------------
   Public API – Minimal & Non-Opinionated
   ---------------------------------------------------------------------- */

/**
 * Link a document to a task
 * @param {string} taskId
 * @param {string} docId
 */
export function linkDocumentToTask(taskId, docId) {
  if (!taskId || !docId) return;

  const existing = taskDocumentLinks[taskId] || [];

  if (existing.includes(docId)) return;

  taskDocumentLinks[taskId] = [...existing, docId];
  save();
}

/**
 * Unlink a document from a task
 * @param {string} taskId
 * @param {string} docId
 */
export function unlinkDocumentFromTask(taskId, docId) {
  if (!taskId || !docId) return;

  const existing = taskDocumentLinks[taskId];
  if (!Array.isArray(existing)) return;

  const updated = existing.filter(id => id !== docId);

  if (updated.length === 0) {
    delete taskDocumentLinks[taskId];
  } else {
    taskDocumentLinks[taskId] = updated;
  }

  save();
}

/**
 * Get document IDs associated with a task
 * @param {string} taskId
 * @returns {string[]}
 */
export function getDocumentsForTask(taskId) {
  if (!taskId) return [];
  return taskDocumentLinks[taskId] || [];
}

/**
 * Replace associations for a task (batch-safe, optional use)
 * @param {string} taskId
 * @param {string[]} docIds
 */
export function setDocumentsForTask(taskId, docIds) {
  if (!taskId || !Array.isArray(docIds)) return;

  taskDocumentLinks[taskId] = [...new Set(docIds)];
  save();
}

/**
 * Clear all associations (dev / migration use only)
 */
export function clearAllTaskDocumentLinks() {
  taskDocumentLinks = {};
  save();
}

/* ----------------------------------------------------------------------
   Initialise on import
   ---------------------------------------------------------------------- */
load();
