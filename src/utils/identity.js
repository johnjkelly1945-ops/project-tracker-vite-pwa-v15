// src/utils/identity.js
// METRA — Canonical Identity Utilities (Stage 20.1.2)

/**
 * Safely compare two person references using canonical personId.
 * Accepts either full Person objects or plain personId strings
 * (to allow controlled transition away from string-based logic).
 */
export function isSamePerson(a, b) {
  if (!a || !b) return false;

  const idA = typeof a === "string" ? a : a.personId;
  const idB = typeof b === "string" ? b : b.personId;

  if (!idA || !idB) return false;

  return idA === idB;
}

/**
 * Derive initials from a display name.
 * DATA utility only — no formatting or UI assumptions.
 *
 * Examples:
 *  "John Kelly"      → "JK"
 *  "Mary Ann Smith" → "MAS"
 */
export function deriveInitials(displayName) {
  if (!displayName || typeof displayName !== "string") return "";

  return displayName
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}
