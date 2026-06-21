// @ts-nocheck

import {
  repoGetPersonParticipation
} from "./SegmentPersonnelRepository";

export function resolvePersonnelParticipation(person) {
  if (!person?.id) return [];

  return repoGetPersonParticipation(person.id)
    .map(record => ({
      role: record.participationType || "ADMIN",
      startedOn: record.appointedOn || "Unknown",
      status: record.active ? "Active" : "Inactive"
    }));
}
