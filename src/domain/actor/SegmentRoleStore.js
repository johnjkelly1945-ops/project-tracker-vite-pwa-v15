// @ts-nocheck
/*
=====================================================================
METRA — SegmentRoleStore.js
Stage 414 — Segment Role Mapping (In-Memory)
=====================================================================

Purpose
---------------------------------------------------------------------
Provide segment-scoped role mapping for actors.

Rules
---------------------------------------------------------------------
• In-memory only
• No persistence
• No authority enforcement
• No UI dependency
• Pure lookup responsibility

=====================================================================
*/

// INTERNAL STORE
const segmentRoles = {};

/*
---------------------------------------------------------------------
Set role for actor in segment
---------------------------------------------------------------------
*/
export function setActorRoleInSegment({ segmentId, actorId, role }) {
  if (!segmentId || !actorId || !role) return;

  if (!segmentRoles[segmentId]) {
    segmentRoles[segmentId] = {};
  }

  segmentRoles[segmentId][actorId] = role;
}

/*
---------------------------------------------------------------------
Get role for actor in segment
---------------------------------------------------------------------
*/
export function getActorRoleInSegment(actorId, segmentId) {
  if (!segmentId || !actorId) return null;

  const segment = segmentRoles[segmentId];
  if (!segment) return null;

  return segment[actorId] || null;
}

/*
---------------------------------------------------------------------
Optional debug helper
---------------------------------------------------------------------
*/
export function __getSegmentRoles() {
  return segmentRoles;
}

/*
---------------------------------------------------------------------
NEW — Get current PM in segment
---------------------------------------------------------------------
*/
export function getCurrentPM(segmentId) {
  const segment = segmentRoles[segmentId];
  if (!segment) return null;

  for (const actorId in segment) {
    if (segment[actorId] === "PM") {
      return actorId;
    }
  }

  return null;
}

/*
---------------------------------------------------------------------
NEW — Assign role with PM enforcement
---------------------------------------------------------------------
*/
export function assignRoleToSegment({
  actingUser,
  segmentId,
  targetActorId,
  role
}) {
  if (!actingUser || !segmentId || !targetActorId || !role) return;

  if (!segmentRoles[segmentId]) {
    segmentRoles[segmentId] = {};
  }

  const segment = segmentRoles[segmentId];
  const currentPM = getCurrentPM(segmentId);

  // PM ASSIGNMENT LOGIC
  if (role === "PM") {
    const actingRole = segment[actingUser.id] || actingUser.role;

    const isCurrentPM = actingUser.id === currentPM;
    const isAdmin = actingRole === "Admin";

    if (!isCurrentPM && !isAdmin) {
      return;
    }

    // Remove existing PM
    if (currentPM && currentPM !== targetActorId) {
      delete segment[currentPM];
    }

    // Assign new PM
    segment[targetActorId] = "PM";
    return;
  }

  // NON-PM ASSIGNMENT
  segment[targetActorId] = role;
}
