// ======================================================================
// METRA – auditHandler.js
// Phase 3.5 – Governance & Template Link Support
// ======================================================================

const auditCache = {}; // { auditRef: [events] }
const linkRegistry = {}; // { auditRef: { templateRef, governanceLink } }

export function logAuditEvent({ actionType, entityType, entityId, auditRef, linkedRef = null }) {
  const entry = {
    actionType,
    entityType,
    entityId,
    auditRef,
    linkedRef,
    timestamp: new Date().toISOString(),
  };
  console.log(
    `[AUDIT] ${actionType} | ${entityType}:${entityId} | Ref:${auditRef}` +
      (linkedRef ? ` | Link:${linkedRef}` : "") +
      ` | ${entry.timestamp}`
  );

  if (!auditCache[auditRef]) auditCache[auditRef] = [];
  auditCache[auditRef].push(entry);
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
