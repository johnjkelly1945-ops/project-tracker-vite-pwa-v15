// @ts-nocheck
/*
=====================================================================
METRA — PersonnelRegistry (Stage 433 Fix)
Global singleton registry (window-bound)
=====================================================================
*/

function ensureGlobal() {
  if (!window.__METRA_PERSONNEL__) {
    window.__METRA_PERSONNEL__ = [];
  }
}

export function setPersonnel(list) {
  ensureGlobal();
  window.__METRA_PERSONNEL__ = Array.isArray(list) ? list : [];
}

export function getPersonnel() {
  ensureGlobal();
  return window.__METRA_PERSONNEL__;
}
