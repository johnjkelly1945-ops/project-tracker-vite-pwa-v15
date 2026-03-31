// @ts-nocheck

import {
  getCurrentPM,
  getActorRoleInSegment
} from "../actor/SegmentRoleStore.js";

import { getPersonnel } from "../personnel/PersonnelRegistry";

export function canPerformAction({ actor, action, target, context }) {
  if (!actor) return false;
  if (!action) return false;

  /* ================= Stage 431 — Canonical Authority (Segment Role Based) ================= */

  const segmentId = context?.segmentId;

  if (!segmentId) return false;

  /* ================= Stage 433 — Personnel-Based Authority ================= */

  const people = getPersonnel() || [];

  const person = people.find(
    p =>
      p.id === actor.id ||
      p.displayName === actor.displayName
  );

  const isPM = person?.isPM === true;
  const isAdmin = person?.isAdmin === true;

  if (!(isPM || isAdmin)) {
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
