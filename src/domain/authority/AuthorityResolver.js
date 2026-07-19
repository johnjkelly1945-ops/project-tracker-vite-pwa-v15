// @ts-nocheck


import { getPersonnel } from "../personnel/PersonnelRegistry";
import { resolveSegmentAuthority } from "./resolveSegmentAuthority";

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

  const authority =
    resolveSegmentAuthority(
      context?.segment,
      actor
    );

  const isPM = authority.isPM;
  const isAdmin = person?.isAdmin === true;

  if (!authority.isPM) {
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


  /* ================= Stage 435 — Contextual Authority Expansion ================= */

  if (action === "ADD_TASK_NOTE") {
    const isAssignee =
      target &&
      target.assigneeId &&
      person && person.id === target.assigneeId;

    if (isAssignee) return true;
  }

  return true;
}
