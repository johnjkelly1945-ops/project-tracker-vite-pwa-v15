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

  let person = people.find(p => p.id === actor.id);

  // Stage 434 — controlled fallback (non-breaking)
  if (!person && actor.displayName) {
    person = people.find(p => p.displayName === actor.displayName);

    if (person) {
      console.warn(
        "[Stage 434] Fallback identity match used:",
        actor.displayName,
        "→",
        person.id
      );
    }
  }

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
