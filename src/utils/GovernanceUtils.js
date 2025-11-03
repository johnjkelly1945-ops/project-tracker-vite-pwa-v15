/* ======================================================================
   METRA – GovernanceUtils.js
   Phase 4.6 A.3C – Data Integration
   ----------------------------------------------------------------------
   Provides helper functions for computing Governance metrics and
   role-based visibility summaries.
   ====================================================================== */

export function getGovernanceMetrics(items = []) {
  const types = ["Change Control", "Risk", "Issue", "Quality", "Template"];
  const result = {};

  types.forEach((t) => {
    const filtered = items.filter((i) => i.type === t);
    result[t] = {
      count: filtered.length,
      lastEntryTime: filtered.length
        ? new Date(filtered[filtered.length - 1].timestampUpdated).toLocaleTimeString()
        : "-",
    };
  });

  return result;
}

export function getRoleVisibilityStats(items = []) {
  return {
    admin: items.filter((i) => i.ownerRole === "Admin").length,
    pmo: items.filter((i) => i.ownerRole === "PMO").length,
    pm: items.filter((i) => i.ownerRole === "PM").length,
    user: items.filter((i) => i.ownerRole === "User").length,
  };
}

/**
 * Format a date/time string into local user-friendly time.
 */
export function formatLocalTime(dateString) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

/* ======================================================================
   Notes:
   • Used by GovernanceSummary.jsx to compute metric counts.
   • Safe with missing or empty item arrays.
   • Matches the data schema of GovernanceStore entries.
   ====================================================================== */
