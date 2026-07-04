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

export function repoGetSegment(segmentId) {
  if (!segmentId) return null;

  const workspace = loadWorkspace();
  const segments = workspace?.segments || [];

  return (
    segments.find(
      (segment) => segment.segmentId === segmentId
    ) || null
  );
}


export function saveWorkspace(workspaceData) {
  saveToLocalStorage(workspaceData);
}
