/* ======================================================================
   METRA – AuditUtils.js
   Phase 4.6 A.3C – Data Integration
   ----------------------------------------------------------------------
   Provides helper functions for extracting and sorting recent audit
   trail entries used in GovernanceSummary.jsx and other modules.
   ====================================================================== */

/**
 * Returns the N most recent audit entries sorted by timestampCreated.
 * Each entry is expected to contain:
 *   { user, action, governanceType, refID, timestampCreated }
 *
 * @param {number} limit  - number of recent entries to return
 * @param {Array} audits  - full audit array (from AuditTrailStore)
 * @returns {Array}       - sorted slice of latest entries
 */
export function getRecentAuditEntries(limit = 10, audits = []) {
  if (!Array.isArray(audits) || audits.length === 0) return [];

  // Defensive copy and sort
  const sorted = [...audits].sort((a, b) => {
    const ta = new Date(a.timestampCreated || a.ts).getTime();
    const tb = new Date(b.timestampCreated || b.ts).getTime();
    return tb - ta; // newest first
  });

  return sorted.slice(0, limit);
}

/**
 * Returns a formatted time string from a timestamp.
 * Used for readability in ActivityStream and dashboards.
 */
export function formatAuditTime(dateString) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

/**
 * Group audit entries by governance type.
 * Example output:
 * {
 *   "Change Control": [...],
 *   "Risk": [...],
 *   "Issue": [...],
 *   "Quality": [...],
 *   "Template": [...]
 * }
 */
export function groupAuditEntriesByType(audits = []) {
  const grouped = {};
  audits.forEach((entry) => {
    const key = entry.governanceType || "Uncategorised";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });
  return grouped;
}

/* ======================================================================
   Notes:
   • Used by GovernanceSummary.jsx to display recent activity.
   • Safe with missing or partial audit data.
   • Automatically sorts entries by newest first.
   • Compatible with both local and live data sources.
   ====================================================================== */
