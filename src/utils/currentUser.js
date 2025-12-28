// src/utils/currentUser.js
// METRA — Canonical currentUser Accessor
// Stage 20.2.1.b
//
// SEMANTICS GOVERNED — implementation only.
// No behaviour change permitted.

import { getPersonId } from "./identity";

/**
 * Returns the canonical currentUser object from the personnel registry.
 * This is the single authoritative accessor.
 */
export function getCurrentUser(personnelRegistry) {
  if (!personnelRegistry) return null;
  return personnelRegistry.currentUser || null;
}

/**
 * Returns the canonical person.id for the current user.
 * Fail-closed: null if identity cannot be resolved.
 */
export function getCurrentUserId(personnelRegistry) {
  const currentUser = getCurrentUser(personnelRegistry);
  return getPersonId(currentUser);
}

/**
 * Legacy-safe helper for components still reading from localStorage.
 * This does NOT assert authority — it only normalises shape.
 */
export function getCurrentUserFromStorage() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed || null;
  } catch {
    return null;
  }
}

/**
 * Canonical identity-safe accessor for legacy storage callers.
 */
export function getCurrentUserIdFromStorage() {
  const user = getCurrentUserFromStorage();
  return getPersonId(user);
}
