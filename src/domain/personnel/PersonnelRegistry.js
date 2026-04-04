// @ts-nocheck
/*
=====================================================================
METRA — PersonnelRegistry (Stage 444 — Persistent Registry)
Global singleton registry with localStorage persistence
=====================================================================
*/

function ensureGlobal() {
  if (!window.__METRA_PERSONNEL__) {
    const stored = localStorage.getItem("metra_personnel");

    if (stored) {
      try {
        window.__METRA_PERSONNEL__ = JSON.parse(stored);
      } catch (e) {
        console.warn("Invalid personnel storage");
        window.__METRA_PERSONNEL__ = [];
      }
    } else {
      window.__METRA_PERSONNEL__ = [];
    }
  }
}

export function setPersonnel(list) {
  const safeList = Array.isArray(list) ? list : [];

  window.__METRA_PERSONNEL__ = safeList;

  try {
    localStorage.setItem("metra_personnel", JSON.stringify(safeList));
  } catch (e) {
    console.warn("Failed to persist personnel");
  }
}

export function getPersonnel() {
  ensureGlobal();
  return window.__METRA_PERSONNEL__;
}
