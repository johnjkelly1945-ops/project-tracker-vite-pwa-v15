/* ======================================================================
   METRA – Document Store
   Stage 10.4 – Controlled Persistence (localStorage)
   ----------------------------------------------------------------------
   PURPOSE:
   • Persist documents deterministically
   • Restore documents on reload
   • No UI logic
   • No task / summary coupling
   ====================================================================== */

const STORAGE_KEY = "metra.documents.v1";

/* ----------------------------------------------------------------------
   Load all documents
   ---------------------------------------------------------------------- */
export function loadDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("METRA: Failed to load documents", e);
    return [];
  }
}

/* ----------------------------------------------------------------------
   Save all documents
   ---------------------------------------------------------------------- */
export function saveDocuments(documents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (e) {
    console.warn("METRA: Failed to save documents", e);
  }
}
