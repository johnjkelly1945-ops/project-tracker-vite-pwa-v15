// @ts-nocheck
/*
======================================================================

METRA — AdvisoryResponsibilityResolver.js
Stage 500S-1 — Advisory Responsibility Contributor

PURPOSE
-------

Contribute constitutional Advisory responsibilities to
MY WORLD.

======================================================================
*/

import resolveAdvisoryNavigation
  from "../governance/AdvisoryNavigationResolver";

export function resolveAdvisoryResponsibilities(
  person,
  tasks = [],
  segments = []
) {

  const responsibilities = [];

  tasks.forEach((task) => {

    const engagements =
      resolveAdvisoryNavigation({
        actor: person,
        taskId: task.id
      });

    if (!engagements.length) {
      return;
    }

    const segment =
      segments.find(
        (s) => s.segmentId === task.segmentId
      );

    engagements.forEach((event) => {

      responsibilities.push({

        appointmentId: null,

        segmentId: task.segmentId,

        segmentName:
          segment?.segmentTitle ||
          "Unknown Segment",

        personId: person.id,

        responsibility:
          "Advisory",

        taskId:
          task.id,

        taskTitle:
          task.title ||
          "Unknown Task",

        appointedAt:
          event.createdAt ||
          "Unknown"

      });

    });

  });

  return responsibilities;
}

export default resolveAdvisoryResponsibilities;
