// @ts-nocheck
/*
=====================================================================
METRA — GovernanceRepository.js
Stage 323 — Governance Domain Persistence (Phase 1)

PURPOSE
---------------------------------------------------------------------
Provide durable persistence for Governance Events using localStorage.

This repository:

• Persists governance events
• Loads on initialisation
• Maintains eventId as primary key
• Is replaceable in future with backend API

Does NOT:
• Enforce governance logic
• Mutate task lifecycle
• Bind to UI
=====================================================================
*/

import {
  notifyProjectionChanged
} from "../projection/ProjectionEngine";

const STORAGE_KEY = "metra_governance_events";

/*
=====================================================================
LOAD
=====================================================================
*/

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/*
=====================================================================
SAVE
=====================================================================
*/

function save(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/*
=====================================================================
REPOSITORY STATE
=====================================================================
*/

let events = load();

/*
=====================================================================
CRUD OPERATIONS
=====================================================================
*/

export function repoCreate(event) {
  events[event.eventId] = event;
  save(events);
  notifyProjectionChanged();
  return event;
}

export function repoGet(eventId) {
  return events[eventId] || null;
}

export function repoGetByTask(taskId) {
  return Object.values(events).filter(
    (event) => event.taskId === taskId
  );
}

export function repoGetAll() {
  return Object.values(events);
}

export function repoUpdate(eventId, updatedEvent) {
  if (!events[eventId]) return null;

  const existing = events[eventId] || {};

  const safeEvent = {
    ...existing,
    ...updatedEvent,
    participation: [
      ...(Array.isArray(existing.participation) ? existing.participation : []),
      ...(Array.isArray(updatedEvent.participation) ? updatedEvent.participation : []),
    ],
    advisoryRecords: Array.isArray(updatedEvent.advisoryRecords)
      ? updatedEvent.advisoryRecords
      : Array.isArray(existing.advisoryRecords)
      ? existing.advisoryRecords
      : [],
  };

  events[eventId] = safeEvent;
  save(events);
  notifyProjectionChanged();
  return events[eventId];
}
export function repoReset() {
  events = {};
  save(events);
  notifyProjectionChanged();
}
