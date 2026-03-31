// @ts-nocheck
/*
=====================================================================
METRA — ActingUser.js (Stage 433 Fix)
Global singleton actor (window-bound)
=====================================================================
*/

function ensureGlobal() {
  if (!window.__METRA_ACTOR__) {
    window.__METRA_ACTOR__ = null;
  }
}

export function setActingUser(user) {
  ensureGlobal();
  window.__METRA_ACTOR__ = user || null;
}

export function getActingUser() {
  ensureGlobal();
  return window.__METRA_ACTOR__;
}

export function clearActingUser() {
  ensureGlobal();
  window.__METRA_ACTOR__ = null;
}
