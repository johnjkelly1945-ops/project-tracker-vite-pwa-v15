/*
======================================================================

METRA — RelationshipStore.js
Stage 481C.2 — Neutral Relationship Store

PURPOSE
-------
Provide canonical read/write access for neutral contextual
segment relationships.

CONSTITUTIONAL RULES
--------------------
• Relationships remain authority-neutral
• Relationships remain observational only
• No governance federation
• No task federation
• No orchestration semantics
• No lifecycle propagation

======================================================================
*/

import {
  repoCreateRelationship,
  repoGetAllRelationships,
  repoGetRelationshipsForSegment
} from "./RelationshipRepository";

export function createRelationship({
  fromSegmentId,
  toSegmentId,
  relationshipType = "ASSOCIATED_WITH",
  createdBy = "system"
}) {
  return repoCreateRelationship({
    fromSegmentId,
    toSegmentId,
    relationshipType,
    createdBy
  });
}

export function getRelationshipsForSegment(segmentId) {
  return repoGetRelationshipsForSegment(segmentId);
}

export function getAllRelationships() {
  return repoGetAllRelationships();
}
