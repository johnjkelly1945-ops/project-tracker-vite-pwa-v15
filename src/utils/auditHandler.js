// ======================================================================
// METRA – auditHandler.js (extended for Governance Queue routing)
// Phase 3.6
// ======================================================================

import { addGovernanceRecord } from "./governanceQueueHandler";

const auditCache = {};
const linkRegistry = {};

export function logAuditEvent({
  actionType,
  entityType,
  entityId,
  auditRef,
  linkedRef = null,
  governanceLink = null,
  type = "Change",
}) {
  const entry = {
    actionType,
    entityType,
    entityId,
    auditRef,
    linkedRef,
    governanceLink,
    timestamp: new Date().toISOString(),
  };

  console.log(
    `[AUDIT] ${actionType} | ${entityType}:${entityId} | Ref:${auditRef}` +
      (governanceLink ? ` | GOV:${governanceLink}` : "") +
      ` | ${entry.timestamp}`
  );

  if (!auditCache[auditRef]) auditCache[auditRef] = [];
  auditCache[auditRef].push(entry);

  // ---- Governance routing ----
  if (governanceLink) {
    addGovernanceRecord({
      type,
      title: `${entityType} – ${actionType}`,
      description: `Auto-logged via auditRef ${auditRef}`,
      auditRef,
      governanceLink,
      templateRef: linkedRef || null,
    });
  }
}

export function getAuditCache(auditRef) {
  return auditCache[auditRef] || [];
}

export function registerLinkedEntity(auditRef, links) {
  linkRegistry[auditRef] = links;
}

export function getLinkedEntity(auditRef) {
  return linkRegistry[auditRef] || {};
}
