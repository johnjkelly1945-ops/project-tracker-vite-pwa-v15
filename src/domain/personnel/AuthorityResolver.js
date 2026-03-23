// @ts-nocheck
/*
=====================================================================
METRA — AuthorityResolver.js
Stage 410 — Actor + Action Introduction (Canon Alignment)
=====================================================================

Purpose
---------------------------------------------------------------------
Introduce actor + action based authority evaluation.

Rules
---------------------------------------------------------------------
• Backward compatible
• No identity inference
• No UI dependency
• Context accepted but not used

=====================================================================
*/
import { getActingUser } from "../actor/ActingUser";

// ACTION CONSTANTS (Stage 410 — single action only)
const ACTIONS = {
  EDIT_PERSONNEL: "EDIT_PERSONNEL"
};

// CORE AUTHORITY FUNCTION (NEW)
export function canPerformAction({ actingUser, action, target, context }) {
  if (!actingUser) return false;

  const role = actingUser.role;

  if (action === ACTIONS.EDIT_PERSONNEL) {
    if (role === "PM") return true;
    if (role === "Admin" && actingUser.isSegmentAdmin === true) return true;
    return false;
  }

  return false;
}

// EXISTING LOGIC PRESERVED
function legacyCanEditPersonnel(person) {
  if (!person) return false;

  const role = person.role;

  if (role === "PM") return true;
  if (role === "Admin" && person.isSegmentAdmin === true) return true;

  return false;
}

// UPDATED WRAPPER (Stage 409 + 410)
export function canEditPersonnel(input) {
  // LEGACY MODE (unchanged behaviour)
  if (!input || typeof input !== "object" || input.role) {
    return legacyCanEditPersonnel(input);
  }

  const { actingUser, targetPerson, context } = input;

  // Fallback if no acting user (non-regression)
  if (!actingUser) {
    return legacyCanEditPersonnel(targetPerson);
  }

  // NEW PATH (Stage 410)
  return canPerformAction({
    actingUser,
    action: ACTIONS.EDIT_PERSONNEL,
    target: targetPerson,
    context
  });
}

