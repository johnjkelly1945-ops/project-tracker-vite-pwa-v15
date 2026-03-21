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
