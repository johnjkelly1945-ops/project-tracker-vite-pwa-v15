// @ts-nocheck
/*
=====================================================================
METRA — GovernanceAccessResolver.js
Stage 419 — Authority Implementation
=====================================================================
*/

export function canViewGovernance({ actor, dataType, context }) {
  if (!actor) return false;

  const role = actor.role;

  if (role === "PM" || role === "ADMIN") {
    return true;
  }

  if (role === "ADVISOR") {
    return dataType === "GOVERNANCE";
  }

  return false;
}
