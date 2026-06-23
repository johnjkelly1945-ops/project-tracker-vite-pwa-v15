/*
======================================================================

METRA — SegmentPersonnelRepository.js
Stage 500D Phase 2B-B

PURPOSE
-------
Provide inert, segment-local persistence for Participation
appointments.

CONSTITUTIONAL RULES
--------------------
• Personnel remains identity only
• Context remains authority only
• Participation is segment-local
• Participation is assigned
• Participation is historical
• Repository stores facts only
• Repository does NOT determine authority
• Repository does NOT determine visibility
• Repository does NOT determine experience
• Repository does NOT mutate context
• Records are never deleted

This repository is intentionally shallow and observational.

======================================================================
*/

const STORAGE_KEY = "metra_segment_personnel";

function loadAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("SegmentPersonnelRepository load failed", e);
    return [];
  }
}

function saveAppointments(list) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.isArray(list) ? list : [])
  );
}

function getParticipationType(record) {
  return record?.participationType || "ADMIN";
}

export function repoGetAllParticipation() {
  return loadAppointments();
}

export function repoAssignParticipation(appointment) {
  const existing = loadAppointments();

  const participationType =
    appointment.participationType || "ADMIN";

  const activeAppointment = existing.find(
    (a) =>
      a.segmentId === appointment.segmentId &&
      a.personId === appointment.personId &&
      getParticipationType(a) === participationType &&
      a.active === true
  );

  if (activeAppointment) {
    return activeAppointment;
  }

  const safeAppointment = {
    appointmentId:
      appointment.appointmentId ||
      `part-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    segmentId: appointment.segmentId || null,

    personId: appointment.personId || null,

    participationType,

    appointedBy:
      appointment.appointedBy || "system",

    appointedOn:
      appointment.appointedOn ||
      new Date().toISOString(),

    removedBy: null,

    removedOn: null,

    active: true
  };

  existing.push(safeAppointment);

  saveAppointments(existing);

  return safeAppointment;
}

export function repoRemoveParticipation(
  segmentId,
  personId,
  participationType,
  removedBy = "system"
) {
  const existing = loadAppointments();

  const appointment = existing.find(
    (a) =>
      a.segmentId === segmentId &&
      a.personId === personId &&
      getParticipationType(a) === participationType &&
      a.active === true
  );

  if (!appointment) {
    return null;
  }

  appointment.active = false;
  appointment.removedBy = removedBy;
  appointment.removedOn = new Date().toISOString();

  saveAppointments(existing);

  return appointment;
}

export function repoRemoveSegmentParticipation(
  segmentId,
  removedBy = "segment_archive"
) {
  if (!segmentId) return [];

  const existing = loadAppointments();

  const removed = [];

  existing.forEach((appointment) => {
    if (
      appointment.segmentId === segmentId &&
      appointment.active === true
    ) {
      appointment.active = false;
      appointment.removedBy = removedBy;
      appointment.removedOn = new Date().toISOString();

      removed.push(appointment);
    }
  });

  saveAppointments(existing);

  return removed;
}

export function repoGetSegmentParticipation(segmentId) {
  if (!segmentId) return [];

  return loadAppointments().filter(
    (a) =>
      a.segmentId === segmentId &&
      a.active === true
  );
}

export function repoGetPersonParticipation(personId) {
  if (!personId) return [];

  return loadAppointments().filter(
    (a) =>
      a.personId === personId &&
      a.active === true
  );
}

export function repoGetActiveParticipation(
  segmentId,
  personId,
  participationType
) {
  return (
    loadAppointments().find(
      (a) =>
        a.segmentId === segmentId &&
        a.personId === personId &&
        getParticipationType(a) === participationType &&
        a.active === true
    ) || null
  );
}
