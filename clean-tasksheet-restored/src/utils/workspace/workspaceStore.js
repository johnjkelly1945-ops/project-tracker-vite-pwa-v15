/* ======================================================================
   METRA — workspaceStore.js
   Workspace Persistence Layer
   ----------------------------------------------------------------------
   RESPONSIBILITIES:
   • Persist task notes
   • Rehydrate task notes
   • No UI logic
   • No workspace mutation
   ====================================================================== */

const STORAGE_KEY = "metra-workspace-tasks";

/* --------------------------------------------------------------
   Internal helpers
   -------------------------------------------------------------- */
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("METRA workspaceStore: failed to load store", err);
    return {};
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn("METRA workspaceStore: failed to save store", err);
  }
}

/* ==============================================================
   WRITE — persist notes (existing behaviour)
   ============================================================== */
export function saveTaskNotes(taskId, notes) {
  if (!taskId) return;

  const store = loadStore();

  store[taskId] = {
    ...(store[taskId] || {}),
    notes: Array.isArray(notes) ? notes : []
  };

  saveStore(store);
}

/* ==============================================================
   READ — rehydrate notes (Stage 11.3)
   ============================================================== */
export function loadTaskNotes(taskId) {
  if (!taskId) return [];

  const store = loadStore();
  return Array.isArray(store?.[taskId]?.notes)
    ? store[taskId].notes
    : [];
}
