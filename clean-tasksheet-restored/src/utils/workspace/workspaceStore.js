/* ======================================================================
   METRA — Workspace Store (Neutral)
   Stage 11.2.7 — In-Memory Workspace-Level Document Store
   ----------------------------------------------------------------------
   PURPOSE:
   • Provide a neutral, pane-agnostic workspace anchor
   • Hold first-class workspace documents
   • Avoid premature workspace unification or UI coupling

   CONSTRAINTS:
   • In-memory only
   • No persistence
   • No React
   • No task or pane ownership
   ====================================================================== */

export const workspaceStore = {
  documents: []
};

/* --------------------------------------------------------------
   Document Store Helpers (Minimal)
   -------------------------------------------------------------- */

/**
 * Add a document to the workspace store.
 */
export function addDocument(document) {
  if (!document) return;
  workspaceStore.documents.push(document);
}

/**
 * Replace an existing document (by id).
 */
export function updateDocument(updated) {
  if (!updated?.id) return;
  const index = workspaceStore.documents.findIndex(
    (doc) => doc.id === updated.id
  );
  if (index !== -1) {
    workspaceStore.documents[index] = updated;
  }
}

/**
 * Get a document by id.
 */
export function getDocumentById(id) {
  return workspaceStore.documents.find((doc) => doc.id === id);
}
