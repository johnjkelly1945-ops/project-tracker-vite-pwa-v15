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

  if (!user) {
    window.__METRA_ACTOR__ = null;
    return;
  }

  try {
    const registry = window.__METRA_PERSONNEL_REGISTRY__;

    let resolvedId = user.id;

    // Attempt canonical resolution via displayName (non-breaking)
    if (!resolvedId && user.displayName && registry?.getPersonnel) {
      const match = registry.getPersonnel().find(
        (p) => p.displayName === user.displayName
      );

      if (match) {
        resolvedId = match.id;

        console.warn(
          "[Stage 434] displayName fallback used to resolve identity:",
          user.displayName,
          "→",
          resolvedId
        );
      }
    }

    if (!resolvedId) {
      console.warn(
        "[Stage 434] Unable to resolve canonical identity for user:",
        user
      );
    }

    window.__METRA_ACTOR__ = {
      ...user,
      id: resolvedId || user.id
    };

  } catch (err) {
    console.warn("[ActingUser] Identity resolution failed:", err);

    window.__METRA_ACTOR__ = user;
  }
}

export function getActingUser() {
  ensureGlobal();
  return window.__METRA_ACTOR__;
}

export function clearActingUser() {
  ensureGlobal();
  window.__METRA_ACTOR__ = null;
}
