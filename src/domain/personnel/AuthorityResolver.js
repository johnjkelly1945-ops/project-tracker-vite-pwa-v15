// @ts-nocheck
/*
=====================================================================
METRA — AuthorityResolver.js
Stage 409 — Context-Based Authority Structure (Non-Behavioural)
=====================================================================

Purpose
---------------------------------------------------------------------
Extend authority resolver to accept structured input without changing
existing behaviour.

Rules
---------------------------------------------------------------------
• No behavioural change
• Backward compatible
• No identity inference
• Context accepted but not used

=====================================================================
*/

// EXISTING LOGIC PRESERVED
function legacyCanEditPersonnel(person) {
  if (!person) return false;

  const role = person.role;

  if (role === "PM") return true;
  if (role === "Admin" && person.isSegmentAdmin === true) return true;

  return false;
}

// NEW WRAPPER (STAGE 409)
export function canEditPersonnel(input) {
  // LEGACY MODE (unchanged behaviour)
  if (!input || typeof input !== "object" || input.role) {
    return legacyCanEditPersonnel(input);
  }

  // STRUCTURED MODE (Stage 409)
  const { actingUser, targetPerson, context } = input;

  // IMPORTANT:
  // • actingUser not yet enforced
  // • context not yet used
  // • behaviour must remain identical to Stage 408

  return legacyCanEditPersonnel(targetPerson);
}
