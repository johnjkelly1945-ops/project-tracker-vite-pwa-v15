/* ======================================================================
   METRA – GovernanceDataBridge.js
   Phase 4.6 B Step 2 – Live Data Reconnect
   ----------------------------------------------------------------------
   • Builds on 4.6 A.8 Verified Stable Build
   • Supplies both programme records and calculated metrics
   • Replaces temporary mock bridge used in linkage test
   ====================================================================== */

// === Raw Governance data (as per 4.6 A.8 stable build) ===
export function getGovernanceData() {
  return [
    {
      id: 1,
      name: "Digital Transformation Programme",
      status: "OnTrack",
      actions: 12,
      overdue: 1,
      owner: "PMO",
      period: "Quarter",
    },
    {
      id: 2,
      name: "Infrastructure Upgrade",
      status: "AtRisk",
      actions: 9,
      overdue: 2,
      owner: "ProjectManager",
      period: "ThisMonth",
    },
    {
      id: 3,
      name: "Compliance Review",
      status: "Completed",
      actions: 7,
      overdue: 0,
      owner: "Admin",
      period: "Year",
    },
  ];
}

// ======================================================================
// LIVE DATA CONNECTORS FOR DASHBOARD
// ======================================================================

// Returns full programme dataset after applying optional filters
export function getProgrammeData(filters) {
  const data = getGovernanceData();

  if (!filters) return data;

  // Example: role / status / period filters can be added later
  let filtered = data;

  if (filters.role && filters.role !== "All") {
    filtered = filtered.filter((p) => p.owner === filters.role);
  }

  if (filters.status && filters.status !== "All") {
    filtered = filtered.filter(
      (p) => p.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  if (filters.period && filters.period !== "All") {
    filtered = filtered.filter((p) => p.period === filters.period);
  }

  return filtered;
}

// ======================================================================
// METRICS CALCULATION FOR GOVERNANCE SUMMARY BAR
// ======================================================================
export function getGovernanceMetrics(filters) {
  const data = getProgrammeData(filters);
  const totalProjects = data.length;
  const totalActions = data.reduce((sum, p) => sum + (p.actions || 0), 0);

  // Count "OnTrack" projects for percentage
  const onTrackCount = data.filter(
    (p) => p.status && p.status.toLowerCase() === "ontrack"
  ).length;
  const onTrackPercent = totalProjects
    ? Math.round((onTrackCount / totalProjects) * 100)
    : 0;

  return {
    totalProjects,
    totalActions,
    onTrackPercent,
  };
}
