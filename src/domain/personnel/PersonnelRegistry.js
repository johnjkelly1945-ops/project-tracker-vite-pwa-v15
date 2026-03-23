/*
Stage 403 — Runtime overlay stabilisation (session-backed)
*/

import { personnel as seedPersonnel } from "../../data/personnel";
import { recordGovernanceEvent } from "../governance/GovernanceEventRecorder";
import { GOVERNANCE_EVENT_TYPES } from "../governance/GovernanceEvent";

const STORAGE_KEY = "metra_personnel_runtime";

function loadRuntime() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRuntime(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

let runtimePersonnel = loadRuntime();

export function getPersonnel() {
  return [...seedPersonnel, ...runtimePersonnel];
}

export function setPersonnel(next) {
  if (!Array.isArray(next)) return;

  const current = runtimePersonnel;

  const currentMap = new Map(current.map(p => [p.id, p]));
  const nextMap = new Map(next.map(p => [p.id, p]));

  // DETECT CREATES + UPDATES
  next.forEach(person => {
    const existing = currentMap.get(person.id);

    if (!existing) {
      // PERSON CREATED
      recordGovernanceEvent({
        type: GOVERNANCE_EVENT_TYPES.PERSON_CREATED,
        actor: "system",
        target: person.id,
        metadata: {
          name: person.displayName,
          role: person.role,
          organisation: person.organisation
        }
      });
    } else {
      // PERSON UPDATED (shallow compare)
      const changed =
        existing.displayName !== person.displayName ||
        existing.role !== person.role ||
        existing.organisation !== person.organisation ||
        existing.email !== person.email ||
        existing.phone !== person.phone;

      if (changed) {
        recordGovernanceEvent({
          type: GOVERNANCE_EVENT_TYPES.PERSON_UPDATED,
          actor: "system",
          target: person.id,
          metadata: {
            updatedFields: true
          }
        });
      }
    }
  });

  const seedIds = new Set(seedPersonnel.map(p => p.id));

  runtimePersonnel = next.filter(p => !seedIds.has(p.id));

  saveRuntime(runtimePersonnel);
}
