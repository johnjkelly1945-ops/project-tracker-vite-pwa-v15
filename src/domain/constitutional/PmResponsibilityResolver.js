// @ts-nocheck
/*
======================================================================

METRA — PmResponsibilityResolver.js
Stage 500L-9A — PM Responsibility Contributor

PURPOSE
-------

Contribute PM constitutional responsibilities to
MY METRA WORLD.

======================================================================
*/

import { resolveSegmentAuthority }
  from "../authority/resolveSegmentAuthority";

export function resolvePmResponsibilities(
  person,
  segments = []
) {

  const responsibilities = [];

  segments.forEach((segment) => {

    const authority =
      resolveSegmentAuthority(
        segment,
        person
      );

    if (!authority.isPM) {
      return;
    }

    responsibilities.push({

      appointmentId: null,

      segmentId: segment.segmentId,

      segmentName:
        segment.segmentTitle ||
        "Unknown Segment",

      personId: person.id,

      responsibility:
        "Segment Manager",

      appointedAt:
        segment.authorisedAt ||
        "Unknown"

    });

  });

  return responsibilities;
}

export default resolvePmResponsibilities;
