/* ======================================================================
   METRA – auditHandler.js
   Phase 4.2-B – Parent Audit Reference Support
   ----------------------------------------------------------------------
   • Adds parentAuditRef storage and filtering
   • Retains safe string handling and backwards compatibility
   ====================================================================== */

const AUDIT_STORAGE_KEY = "metra_audit_log_v2";

// ------------------------------------------------------------
// Utility: safe string conversion
// ------------------------------------------------------------
function toPlainString(input) {
  if (input === null || input === undefined) return "";
  if (typeof input === "object") {
    try {
      return JSON.stringify(input);
    } catch {
      return String(input);
    }
  }
  return String(input);
}

// ------------------------------------------------------------
// Log new audit event
// ------------------------------------------------------------
export function logAuditEvent({
  actionType = "UPDATE",
  entityType = "Task",
  entityId = "unknown",
  auditRef = "",
  parentAuditRef = "",
  notePreview = "",
}) {
  const timestamp = new Date().toISOString();

  const cleanEvent = {
    timestamp,
    actionType: toPlainString(actionType),
    entityType: toPlainString(entityType),
    entityId: toPlainString(entityId),
    auditRef: toPlainString(auditRef),
    parentAuditRef: toPlainString(parentAuditRef),
    notePreview: toPlainString(notePreview),
  };

  const existing =
    JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]") || [];
  existing.push(cleanEvent);

  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existing));
  console.log(
    `[AUDIT] ${cleanEvent.actionType} | ${cleanEvent.entityType}:${cleanEvent.entityId} | Ref:${cleanEvent.auditRef} ${cleanEvent.parentAuditRef ? `(Parent:${cleanEvent.parentAuditRef})` : ""}`
  );
}

// ------------------------------------------------------------
// List all audit events for a given entity
// ------------------------------------------------------------
export function listAuditEvents(entityId) {
  const all = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
  return all.filter((e) => e.entityId === String(entityId));
}

// ------------------------------------------------------------
// List audit events by parent reference (hierarchical view)
// ------------------------------------------------------------
export function listAuditEventsByParent(parentAuditRef) {
  if (!parentAuditRef) return [];
  const all = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
  return all.filter((e) => e.parentAuditRef === String(parentAuditRef));
}

// ------------------------------------------------------------
// Utility: clear all audit logs (for testing)
// ------------------------------------------------------------
export function clearAuditLog() {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
  console.warn("[AUDIT] Cleared all local audit logs");
}
