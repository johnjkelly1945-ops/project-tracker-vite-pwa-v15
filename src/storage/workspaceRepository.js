// ======================================================================
// METRA — Workspace Repository (Stage 357)
// ======================================================================
//
// Responsibility:
// - Provide abstraction boundary for workspace persistence.
// - App must only call load() and save() from this file.
// - Implementation detail (localStorage) is hidden.
//
// No authority logic.
// No lifecycle logic.
// No UI behaviour.
// ======================================================================

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./localStorageAdapter";

export function loadWorkspace() {
  return loadFromLocalStorage();
}

export function saveWorkspace(workspaceData) {
  saveToLocalStorage(workspaceData);
}
