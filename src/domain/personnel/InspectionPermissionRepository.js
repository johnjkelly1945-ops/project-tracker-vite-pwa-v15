/*
======================================================================

METRA — InspectionPermissionRepository.js
Stage 500A — Segment Personnel Stewardship Foundation

PURPOSE
-------
Provide inert, segment-local persistence for inspection visibility
grants.

CONSTITUTIONAL RULES
--------------------
• Inspection represents visibility only
• Visibility never grants mutation
• Visibility never grants authority
• Visibility is segment-local
• Repository stores facts only
• Repository does NOT determine authority
• Repository does NOT determine visibility behaviour
• Repository does NOT mutate context
• Records are never deleted

This repository is intentionally shallow and observational.

======================================================================
*/

const STORAGE_KEY = "metra_inspection_permissions";

function loadGrants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("InspectionPermissionRepository load failed", e);
    return [];
  }
}

function saveGrants(list) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.isArray(list) ? list : [])
  );
}

export function repoGetAllInspectionGrants() {
  return loadGrants();
}

export function repoGrantInspection(grant) {
  const existing = loadGrants();

  const activeGrant = existing.find(
    (g) =>
      g.segmentId === grant.segmentId &&
      g.personId === grant.personId &&
      g.surfaceId === grant.surfaceId &&
      g.active === true
  );

  if (activeGrant) {
    return activeGrant;
  }

  const safeGrant = {
    grantId:
      grant.grantId ||
      `grant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    segmentId: grant.segmentId || null,

    personId: grant.personId || null,

    surfaceId: grant.surfaceId || null,

    grantedBy: grant.grantedBy || "system",

    grantedOn:
      grant.grantedOn || new Date().toISOString(),

    revokedBy: null,

    revokedOn: null,

    active: true
  };

  existing.push(safeGrant);

  saveGrants(existing);

  return safeGrant;
}

export function repoRevokeInspection(
  segmentId,
  personId,
  surfaceId,
  revokedBy = "system"
) {
  const existing = loadGrants();

  const grant = existing.find(
    (g) =>
      g.segmentId === segmentId &&
      g.personId === personId &&
      g.surfaceId === surfaceId &&
      g.active === true
  );

  if (!grant) {
    return null;
  }

  grant.active = false;
  grant.revokedBy = revokedBy;
  grant.revokedOn = new Date().toISOString();

  saveGrants(existing);

  return grant;
}

export function repoHasInspectionGrant(
  segmentId,
  personId,
  surfaceId
) {
  if (!segmentId || !personId || !surfaceId) {
    return false;
  }

  return loadGrants().some(
    (g) =>
      g.segmentId === segmentId &&
      g.personId === personId &&
      g.surfaceId === surfaceId &&
      g.active === true
  );
}

export function repoGetInspectionGrants(segmentId) {
  if (!segmentId) return [];

  return loadGrants().filter(
    (g) =>
      g.segmentId === segmentId &&
      g.active === true
  );
}
