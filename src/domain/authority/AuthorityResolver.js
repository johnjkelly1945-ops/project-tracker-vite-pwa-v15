// @ts-nocheck

import {
  getCurrentPM,
  getActorRoleInSegment
} from "../actor/SegmentRoleStore.js";

export function canPerformAction({ actor, action, target, context }) {
  if (!actor) return false;
  if (!action) return false;

  /* ================= Stage 431 — Canonical Authority (Segment Role Based) ================= */

  const segmentId = context?.segmentId;

  if (!segmentId) return false;

  const pmId = getCurrentPM(segmentId);

  const isPM = actor.id === pmId;

  const role = getActorRoleInSegment(actor.id, segmentId);

  const isAdminWithAuthority =
    role === "Admin" &&
    actor.governanceAuthority === true;

  if (!(isPM || isAdminWithAuthority)) {
    return false;
  }

  if (context && target && context.segmentId && target.segmentId) {
    if (context.segmentId !== target.segmentId) {
      return false;
    }
  }

  if (action === "ADD_TASK_NOTE" && target.surface !== "TASK") {
    return false;
  }

  return true;
}
