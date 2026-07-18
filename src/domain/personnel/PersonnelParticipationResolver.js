// @ts-nocheck

import {
  repoGetPersonParticipation,
  repoGetAllParticipation
} from "./SegmentPersonnelRepository";

export function resolvePersonnelParticipation(person, segments = []) {
  if (!person?.id) return [];

  const participation =
    repoGetPersonParticipation(person.id);

  return participation
    .map(record => {
      const segment = segments.find(
        s => s.segmentId === record.segmentId
      );

      return {
        appointmentId: record.appointmentId,

        segmentId: record.segmentId,

        segmentName:
          segment?.segmentTitle ||
          "Unknown Segment",

        personId: record.personId,

        responsibility:
          record.participationType || "ADMIN",

        appointedAt:
          record.appointedOn || "Unknown"
      };
    });
}

export function resolvePersonnelExperience(person) {
  if (!person?.id) return [];

  const counts = {};

  repoGetAllParticipation()
    .filter(
      (record) =>
        record.personId === person.id &&
        record.removedOn
    )
    .forEach((record) => {
      const role =
        record.participationType || "ADMIN";

      counts[role] = (counts[role] || 0) + 1;
    });

  return Object.entries(counts).map(
    ([role, count]) => ({
      role,
      count
    })
  );
}
