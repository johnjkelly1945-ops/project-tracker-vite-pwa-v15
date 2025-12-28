/**
 * METRA — Identity Utilities
 * Stage 20.2.1.a
 *
 * Canonical identity handling.
 * SEMANTICS GOVERNED — DO NOT EXTEND WITHOUT SEM APPROVAL.
 */

/**
 * Derive canonical person.id from any supported shape.
 * Fail-closed: returns null if identity cannot be resolved.
 */
export function getPersonId(input) {
  if (!input) return null;

  // Canonical Person object
  if (typeof input === "object" && input.id) {
    return input.id;
  }

  // Defensive support for legacy shapes
  if (typeof input === "object") {
    if (input.person && input.person.id) return input.person.id;
    if (input.personId) return input.personId;
  }

  // Explicitly reject strings (email, name, etc.)
  return null;
}

/**
 * Canonical identity comparison.
 * Returns true only if both inputs resolve to the same person.id.
 */
export function isSamePerson(a, b) {
  const idA = getPersonId(a);
  const idB = getPersonId(b);

  if (!idA || !idB) return false;
  return idA === idB;
}

/**
 * Assert identity presence (explicit use only).
 * Throws when identity cannot be resolved.
 */
export function assertPersonIdentity(input, context = "unknown") {
  const id = getPersonId(input);
  if (!id) {
    throw new Error(
      `METRA Identity Error: Unable to resolve person.id (${context})`
    );
  }
  return id;
}
