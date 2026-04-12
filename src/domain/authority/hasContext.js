import { getGovernanceEventsByTask } from "../../governance/governanceStore";
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

  // Advisory participation context
  if (task && actor && actor.id) {
    const events = getGovernanceEventsByTask(task.id) || [];

    const isParticipant = events.some(e =>
      Array.isArray(e.participation) &&
      e.participation.some(p => p.reviewerId === actor.id)
    );

    if (isParticipant) return true;
  }

  return false;
}
