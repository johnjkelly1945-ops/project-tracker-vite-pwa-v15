// @ts-nocheck

import { isActionAllowed } from "./PermissionMatrix.js";

export function canPerformAction({ actor, action, target, context }) {
  if (!actor) return false;
  if (!action) return false;

  const role = actor.role;

  if (!isActionAllowed(role, action)) {
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
