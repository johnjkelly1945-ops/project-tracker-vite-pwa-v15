/*
======================================================================

METRA — RelationshipResolver.js
Stage 481C.2 — Read-Only Relationship Composition

PURPOSE
-------
Provide shallow observational composition of contextual
segment relationships.

CONSTITUTIONAL RULES
--------------------
• Read-only resolver only
• No authority derivation
• No governance traversal
• No task traversal
• No orchestration semantics
• No lifecycle mutation

Resolvers compose visibility context only.

======================================================================
*/

import {
  repoGetAllRelationships,
  repoGetRelationshipsForSegment
} from "./RelationshipRepository";

export function resolveRelationshipsForSegment(segmentId) {
  if (!segmentId) return [];

  return repoGetRelationshipsForSegment(segmentId);
}

export function resolveRelatedSegmentIds(segmentId) {
  if (!segmentId) return [];

  const relationships = repoGetRelationshipsForSegment(segmentId);

  const ids = new Set();

  relationships.forEach((r) => {
    if (r.fromSegmentId === segmentId && r.toSegmentId) {
      ids.add(r.toSegmentId);
    }

  });

  return [...ids];
}

export function resolveRelationshipTopology() {
  return repoGetAllRelationships().map((r) => ({
    relationshipId: r.relationshipId,
    fromSegmentId: r.fromSegmentId,
    toSegmentId: r.toSegmentId,
    relationshipType: r.relationshipType
  }));
}

export function resolveDashboardProjectionTopology(
  segmentId,
  projectionResolver
) {
  if (!segmentId) return [];

  if (typeof projectionResolver !== "function") return [];

  const relationships =
    repoGetRelationshipsForSegment(segmentId);

  return relationships.map((r) => {
    const relatedSegmentId =
      r.fromSegmentId === segmentId
        ? r.toSegmentId
        : r.fromSegmentId;

    return {
      relationshipId: r.relationshipId,
      relationshipType: r.relationshipType,
      relatedSegmentId,
      projection:
        projectionResolver(relatedSegmentId)
    };
  });
}
