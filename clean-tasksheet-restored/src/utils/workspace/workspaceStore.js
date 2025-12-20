/* ======================================================================
   METRA — Workspace Store (Neutral)
   Stage 11.3.2 — Document Persistence (localStorage)
   ----------------------------------------------------------------------
   RULES:
   • Persist documents only
   • Versioned schema
   • Safe load with fallback
   • No UI, no tasks, no panes
   ====================================================================== */

const STORAGE_KEY = "metra.workspace";
const SCHEMA_VERSION = 1;

export const workspaceStore = {
  documents: []
};

/* --------------------------------------------------------------
   Persistence Helpers
   -------------------------------------------------------------- */

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return;

    if (Array.isArray(parsed.documents)) {
      workspaceStore.documents = parsed.documents;
    }
  } catch (err) {
    // Silent fallback — do not crash app
  }
}

function saveToStorage() {
  try {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      documents: workspaceStore.documents
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // Silent failure — persistence must not break runtime
  }
}

/* --------------------------------------------------------------
   Public Store API
   -------------------------------------------------------------- */

export function initialiseWorkspaceStore() {
  loadFromStorage();
}

export function addDocument(document) {
  if (!document) return;
  workspaceStore.documents.push(document);
  saveToStorage();
}

export function updateDocument(updated) {
  if (!updated?.id) return;
  const index = workspaceStore.documents.findIndex(
    (doc) => doc.id === updated.id
  );
  if (index !== -1) {
    workspaceStore.documents[index] = updated;
    saveToStorage();
  }
}

export function getDocumentById(id) {
  return workspaceStore.documents.find((doc) => doc.id === id);
}
