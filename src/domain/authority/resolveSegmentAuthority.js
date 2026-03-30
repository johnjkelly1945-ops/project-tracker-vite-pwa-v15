// @ts-nocheck
/*
=====================================================================
METRA — resolveSegmentAuthority.js
Stage 430E — Authority Resolution (Canonical)
=====================================================================
Purpose:
• Determine controller and PM status within a segment
• Provide deterministic authority resolution
• No mutation — pure function
=====================================================================
*/

export function resolveSegmentAuthority(segment, actor) {
  if (!segment || !actor) {
    return {
      isController: false,
      isPM: false
    };
  }

  const isController = segment.createdBy === actor.id;

  const isPM =
    segment.pmId === actor.id ||
    (segment.pmId == null && isController);

  return {
    isController,
    isPM
  };
}
