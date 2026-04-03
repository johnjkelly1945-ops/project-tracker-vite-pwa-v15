export function hasContext(actor, task) {
  if (!actor) return false;

  // PM / Admin override (only if present)
  if (actor.isPM === true || actor.isAdmin === true) {
    return true;
  }

  // Assignee-based context
  if (task && task.assigneeId && actor.id === task.assigneeId) {
    return true;
  }

  return false;
}
