/*
======================================================================

METRA — SegmentPersonnelRepository.js
Stage 500A — Segment Personnel Stewardship Foundation

PURPOSE
-------
Provide inert, segment-local persistence for Admin stewardship
appointments.

CONSTITUTIONAL RULES
--------------------
• Personnel remains identity only
• Context remains authority only
• Admin represents stewardship
• Stewardship is segment-local
• Repository stores facts only
• Repository does NOT determine authority
• Repository does NOT determine visibility
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

export function repoGetAllAdminAppointments() {
  return loadAppointments();
}

export function repoAppointAdmin(appointment) {
  const existing = loadAppointments();

  const activeAppointment = existing.find(
    (a) =>
      a.segmentId === appointment.segmentId &&
      a.personId === appointment.personId &&
      a.active === true
  );

  if (activeAppointment) {
    return activeAppointment;
  }

  const safeAppointment = {
    appointmentId:
      appointment.appointmentId ||
      `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    segmentId: appointment.segmentId || null,

    personId: appointment.personId || null,

    appointedBy: appointment.appointedBy || "system",

    appointedOn:
      appointment.appointedOn || new Date().toISOString(),

    removedBy: null,

    removedOn: null,

    active: true
  };

  existing.push(safeAppointment);

  saveAppointments(existing);

  return safeAppointment;
}

export function repoRemoveAdmin(
  segmentId,
  personId,
  removedBy = "system"
) {
  const existing = loadAppointments();

  const appointment = existing.find(
    (a) =>
      a.segmentId === segmentId &&
      a.personId === personId &&
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

export function repoGetSegmentAdmins(segmentId) {
  if (!segmentId) return [];

  return loadAppointments().filter(
    (a) =>
      a.segmentId === segmentId &&
      a.active === true
  );
}

export function repoIsSegmentAdmin(segmentId, personId) {
  if (!segmentId || !personId) return false;

  return loadAppointments().some(
    (a) =>
      a.segmentId === segmentId &&
      a.personId === personId &&
      a.active === true
  );
}
