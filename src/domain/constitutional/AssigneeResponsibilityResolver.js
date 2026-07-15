// @ts-nocheck
/*
======================================================================

METRA — AssigneeResponsibilityResolver.js
Stage 500L-11A — Assignee Responsibility Contributor

PURPOSE
-------

Contribute constitutional Assignee responsibilities to
MY WORLD.

======================================================================
*/

export function resolveAssigneeResponsibilities(
  person,
  tasks = [],
  segments = []
) {

  const responsibilities = [];

  tasks.forEach((task) => {

    if (task.assigneeId !== person.id) {
      return;
    }

    const segment =
      segments.find(
        (s) => s.segmentId === task.segmentId
      );

    responsibilities.push({

      appointmentId: null,

      segmentId: task.segmentId,

      segmentName:
        segment?.segmentTitle ||
        "Unknown Segment",

      personId: person.id,

      responsibility:
        "Assignee",

      taskId:
        task.id,

      taskTitle:
        task.title ||
        "Unknown Task",

      appointedAt:
        task.assignedAt ||
        "Unknown"

    });

  });

  return responsibilities;
}

export default resolveAssigneeResponsibilities;
