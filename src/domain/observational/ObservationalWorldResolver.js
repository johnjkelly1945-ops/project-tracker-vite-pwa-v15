// @ts-nocheck

/*
======================================================================

METRA — ObservationalWorldResolver.js
Stage 485F.2 — Single-Hop Observational Composition

PURPOSE
----------------------------------------------------------------------
Provide constitutional scaffolding for sovereign observational
world composition.

This resolver currently establishes:
• sovereign-local awareness wrapping
• direct observational adjacency composition
• projection-safe observed world structure
• recursion-ready composition boundaries

This resolver does NOT:
• recurse
• aggregate enterprise state
• mutate governance
• flatten sovereignty
• traverse operational execution
• perform orchestration
• interpret governance meaning

CONSTITUTIONAL RULES
----------------------------------------------------------------------
• Worlds remain sovereign
• Observation remains read-only
• Federation remains non-authoritative
• Awareness remains projection-only
• Operational truth remains sovereign-local

Resolvers compose awareness context only.

======================================================================
*/

import { resolveOpenGovernanceCounts }
  from "../governance/dashboardResolvers";

import {
  resolveRelatedSegmentIds
} from "../relationships/RelationshipResolver";

export function resolveObservationalWorld(
  segment,
  allSegments = []
) {
  if (!segment) return null;

  const relatedSegmentIds =
    resolveRelatedSegmentIds(segment.segmentId);

  const observedWorlds =
    relatedSegmentIds
      .map((relatedId) =>
        allSegments.find(
          (s) => s.segmentId === relatedId
        )
      )
      .filter(Boolean)
      .map((relatedSegment) => ({
        segmentId:
          relatedSegment.segmentId || null,

        segmentType:
          relatedSegment.segmentType || "SEGMENT",

        segmentTitle:
          relatedSegment.segmentTitle ||
          "Untitled Segment",

        awareness:
          resolveOpenGovernanceCounts(
            relatedSegment.segmentId
          ),

        observedWorlds: [],
      }));

  return {
    segmentId: segment.segmentId || null,

    segmentType:
      segment.segmentType || "SEGMENT",

    segmentTitle:
      segment.segmentTitle || "Untitled Segment",

    awareness:
      resolveOpenGovernanceCounts(
        segment.segmentId
      ),

    observedWorlds,
  };
}


export function resolveCoordinationProjectionWorld(
  segment,
  allSegments = [],
  authorityLevel = null,
  relationships = []
) {
  if (!segment) return [];

  const coordinatedIds = new Set();

  relationships.forEach((r) => {
    if (r.relationshipType !== "COORDINATES") return;

    coordinatedIds.add(r.toSegmentId);
  });

  const isOrphaned = (candidate) => {
    if (!candidate?.segmentId) return false;

    return !coordinatedIds.has(candidate.segmentId);
  };


  const visibilityType =
    authorityLevel || segment.segmentType;
  return allSegments.filter((candidate) => {
    if (!candidate) return false;

    if (candidate.archived) return false;

    if (candidate.segmentId === segment.segmentId) {
      return false;
    }

      if (
        visibilityType === "FEASIBILITY"
      ) {
        return false;
      }

      if (
        visibilityType === "PROJECT"
      ) {
        return (
          candidate.segmentType === "FEASIBILITY" &&
          isOrphaned(candidate)
        );
      }

      if (
        visibilityType === "PROGRAMME"
      ) {
        return (
          (
            candidate.segmentType === "FEASIBILITY" &&
            isOrphaned(candidate)
          ) ||
          (
            candidate.segmentType === "PROJECT" &&
            isOrphaned(candidate)
          ) ||
            (
              candidate.segmentType === "PROGRAMME" &&
              isOrphaned(candidate)
            )
        );
      }

      return false;

  });
}
