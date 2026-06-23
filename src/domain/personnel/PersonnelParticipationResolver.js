// @ts-nocheck

import {
  repoGetPersonParticipation,
  repoGetAllParticipation
} from "./SegmentPersonnelRepository";

export function resolvePersonnelParticipation(person) {
  if (!person?.id) return [];

  return repoGetPersonParticipation(person.id)
    .map(record => ({
      segmentId: record.segmentId,
      personId: record.personId,
      participationType:
        record.participationType || "ADMIN",

      role:
        record.participationType || "ADMIN",

      startedOn:
        record.appointedOn || "Unknown"
    }));
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
