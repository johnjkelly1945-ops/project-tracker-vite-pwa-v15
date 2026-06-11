/*
======================================================================

METRA — RelationshipRepository.js
Stage 481C.2 — Neutral Relationship Persistence (FOUNDATIONAL)

PURPOSE
-------
Provide inert, authority-neutral persistence for contextual
relationships between sovereign operational segments.

CONSTITUTIONAL RULES
--------------------
• Relationships are contextual descriptors only
• Relationships do NOT imply authority
• Relationships do NOT create hierarchy
• Relationships do NOT mutate governance
• Relationships do NOT orchestrate execution
• Relationships do NOT federate tasks

This repository is intentionally shallow and observational.

======================================================================
*/

const STORAGE_KEY = "metra_segment_relationships";

function loadRelationships() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("RelationshipRepository load failed", e);
    return [];
  }
}

function saveRelationships(list) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.isArray(list) ? list : [])
  );
}

export function repoGetAllRelationships() {
  return loadRelationships();
}

export function repoCreateRelationship(relationship) {
  const existing = loadRelationships();

  const safeRelationship = {
    relationshipId:
      relationship.relationshipId ||
      `rel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    fromSegmentId: relationship.fromSegmentId || null,

    toSegmentId: relationship.toSegmentId || null,

    relationshipType:
      relationship.relationshipType || "ASSOCIATED_WITH",

    createdAt:
      relationship.createdAt || new Date().toISOString(),

    createdBy:
      relationship.createdBy || "system"
  };

  const duplicate = existing.find(
    (r) =>
      r.fromSegmentId === safeRelationship.fromSegmentId &&
      r.toSegmentId === safeRelationship.toSegmentId &&
      r.relationshipType === safeRelationship.relationshipType
  );

  if (duplicate) {
    return duplicate;
  }

  if (safeRelationship.relationshipType === "COORDINATES") {
    const existingCoordinator = existing.find(
      (r) =>
        r.relationshipType === "COORDINATES" &&
        r.toSegmentId === safeRelationship.toSegmentId
    );

    if (existingCoordinator) {
      return null;
    }
  }

  existing.push(safeRelationship);

  saveRelationships(existing);

  return safeRelationship;
}

export function repoGetRelationshipsForSegment(segmentId) {
  if (!segmentId) return [];

  return loadRelationships().filter(
    (r) =>
      r.fromSegmentId === segmentId ||
      r.toSegmentId === segmentId
  );
}
