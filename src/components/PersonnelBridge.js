/* ======================================================================
   METRA – PersonnelBridge.js
   v4.6B.15 – Assignment Change Audit Events (Stage 15.1)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Central point for personnel assignment logic
   ✔ Append-only audit of assignment changes
   ✔ Stateless, deterministic, side-effect free
   ----------------------------------------------------------------------
   STAGE 15.1 SEMANTICS (LOCKED):
   • Assignment changes are events, not overwrites
   • Events are append-only
   • Records: from → to, timestamp, initiating role
   • Current assignment remains task.assigned
   ====================================================================== */

export const PersonnelBridge = {
  assignPerson(task, name) {
    const previous = task.assigned || "";
    const next = name || "";

    // No-op: assignment unchanged → no audit event
    if (previous === next) {
      return task;
    }

    const timestamp = Date.now();

    const newEvent = {
      from: previous,
      to: next,
      timestamp,
      initiatedByRole: "Creator"
    };

    const existingEvents = Array.isArray(task.assignmentEvents)
      ? task.assignmentEvents
      : [];

    return {
      ...task,
      assigned: next,
      assignmentEvents: [...existingEvents, newEvent]
    };
  }
};
