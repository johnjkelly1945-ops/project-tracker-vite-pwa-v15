// src/utils/currentUser.js
// METRA — Canonical currentUser Accessor (Stage 20.1.3)

import { personnelRegistry } from "../data/personnelRegistry";

/**
 * Returns the canonical current user as a Person record.
 * This is the ONLY approved entry point for identity-aware logic
 * going forward.
 *
 * Existing code may still use legacy currentUser strings.
 * That will be normalised incrementally in later steps.
 */
export function getCurrentUser() {
  return personnelRegistry.currentUser;
}

/**
 * Convenience accessor for canonical personId.
 * Useful for identity comparisons during migration.
 */
export function getCurrentUserId() {
  return personnelRegistry.currentUser?.personId || null;
}
