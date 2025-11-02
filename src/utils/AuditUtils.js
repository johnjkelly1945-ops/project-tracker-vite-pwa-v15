/* =====================================================================
   METRA – AuditUtils.js
   Phase 4.6 A.2 · Time formatting + extended retrieval
   ===================================================================== */

export function getAllAuditEntries() {
  try {
    return JSON.parse(localStorage.getItem("metra_audit_log") || "[]");
  } catch (err) {
    console.error("AuditUtils: failed to parse audit log", err);
    return [];
  }
}

export function getEntriesByKeyRef(keyRef) {
  const all = getAllAuditEntries();
  return all.filter((e) => e.keyRef === keyRef);
}

export function addAuditEntry(entry) {
  const all = getAllAuditEntries();
  all.push({
    ...entry,
    timestampCreated: entry.timestampCreated || new Date().toISOString(),
  });
  localStorage.setItem("metra_audit_log", JSON.stringify(all));
}

/* === New helper: convert UTC to local readable time === */
export function formatLocalTime(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoString;
  }
}
