/* ======================================================================
   METRA – auditHandler.js
   Phase 4.1H2 – Final Audit Sanitisation Fix
   ----------------------------------------------------------------------
   • Removes final “[object Object]” issue
   • Prevents double-stringification of notes
   • Ensures all fields are readable, plain strings
   • Fully compatible with PopupUniversal v4.1H
   ====================================================================== */

const AUDIT_STORAGE_KEY = "metra_audit_log_v1";

// ------------------------------------------------------------
// Safe string conversion (non-nested, non-JSON-stringified)
// ------------------------------------------------------------
function toPlainString(input) {
  if (input === null || input === undefined) return "";
  if (typeof input === "object") {
    // Avoid double-encoded JSON – extract text if present
    if (input.text) return String(input.text);
    if (input.name) return String(input.name);
    if (input.title) return String(input.title);
    return Object.values(input).join(" ");
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
  notePreview = "",
}) {
  const timestamp = new Date().toISOString();

  const cleanEvent = {
    timestamp,
    actionType: toPlainString(actionType),
    entityType: toPlainString(entityType),
    entityId: toPlainString(entityId),
    auditRef: toPlainString(auditRef),
    notePreview: toPlainString(notePreview),
  };

  const existing =
    JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]") || [];
  existing.push(cleanEvent);

  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existing));

  console.log(
    `[AUDIT] ${cleanEvent.actionType} | ${cleanEvent.entityType}:${cleanEvent.entityId} | Ref:${cleanEvent.auditRef} | Note:${cleanEvent.notePreview}`
  );
}

// ------------------------------------------------------------
// List all audit events for a given entity
// ------------------------------------------------------------
export function listAuditEvents(entityId) {
  try {
    const all = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || "[]");
    if (!entityId) return all;
    return all.filter((e) => String(e.entityId) === String(entityId));
  } catch {
    return [];
  }
}

// ------------------------------------------------------------
// Utility: clear all audit logs (for testing)
// ------------------------------------------------------------
export function clearAuditLog() {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
  console.warn("[AUDIT] Cleared all local audit logs");
}
