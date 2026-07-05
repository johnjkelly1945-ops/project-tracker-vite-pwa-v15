import { getGovernanceEventsByTask } from "../../governance/governanceStore";
import { repoGetSegment } from "../../storage/workspaceRepository";
import { resolveOperationalAuthority } from "../operation/OperationalAuthorityResolver";

export function hasContext(actor, task) {
  if (!actor || !task) return false;

  const segment = repoGetSegment(task.segmentId);
  const { isOperational } = resolveOperationalAuthority({
    actor,
    segment,
    task
  });

  if (isOperational) {
    return true;
  }

  if (task.assigneeId && actor.id === task.assigneeId) {
    return true;
  }

  const events = getGovernanceEventsByTask(task.id) || [];

  const isParticipant = events.some(e =>
    Array.isArray(e.participation) &&
    e.participation.some(p => p.reviewerId === actor.id)
  );

  if (isParticipant) {
    return true;
  }

  return false;
}
