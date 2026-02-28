// ======================================================================
// METRA — Local Storage Adapter (Stage 357)
// ======================================================================
//
// Responsibility:
// - Persist and retrieve workspace state using localStorage.
// - Validate schemaVersion.
// - Fail safely if invalid.
//
// This file must contain NO UI logic and NO authority logic.
// ======================================================================

const STORAGE_KEY = "METRA_WORKSPACE_V1";

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || parsed.schemaVersion !== 1) {
      console.warn(
        "Invalid or incompatible workspace schema. Starting empty."
      );
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn(
      "Workspace data could not be loaded. Starting empty.",
      error
    );
    return null;
  }
}

export function saveToLocalStorage(workspaceData) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(workspaceData)
    );
  } catch (error) {
    console.warn("Workspace could not be saved.", error);
  }
}
