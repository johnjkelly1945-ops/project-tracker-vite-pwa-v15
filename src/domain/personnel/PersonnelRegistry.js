/*
Stage 403 — Runtime overlay stabilisation (session-backed)
*/

import { personnel as seedPersonnel } from "../../data/personnel";

const STORAGE_KEY = "metra_personnel_runtime";

function loadRuntime() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRuntime(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

let runtimePersonnel = loadRuntime();

export function getPersonnel() {
  return [...seedPersonnel, ...runtimePersonnel];
}

export function setPersonnel(next) {
  if (!Array.isArray(next)) return;

  const seedIds = new Set(seedPersonnel.map(p => p.id));

  runtimePersonnel = next.filter(p => !seedIds.has(p.id));

  saveRuntime(runtimePersonnel);
}
