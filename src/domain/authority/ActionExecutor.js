// @ts-nocheck

import { canPerformAction } from "./AuthorityResolver.js";

export function attemptAction({
  actor,
  action,
  target,
  context,
  execute
}) {
  const allowed = canPerformAction({
    actor,
    action,
    target,
    context
  });

  if (!allowed) {
    console.warn("[METRA AUTHORITY DENIED]", {
      actor,
      action,
      target,
      context
    });
    return false;
  }

  return execute();
}
