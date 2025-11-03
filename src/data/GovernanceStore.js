/* ======================================================================
   METRA – GovernanceStore.js
   Phase 4.6 A.3C – Data Integration
   ----------------------------------------------------------------------
   Temporary local data source representing governance items for testing.
   Will be replaced by live context or database feed in later phases.
   ====================================================================== */

const GovernanceStore = [
  {
    id: 1,
    type: "Change Control",
    ownerRole: "Admin",
    status: "Approved",
    timestampCreated: "2025-11-02T08:30:00Z",
    timestampUpdated: "2025-11-02T08:45:00Z",
  },
  {
    id: 2,
    type: "Risk",
    ownerRole: "PMO",
    status: "Open",
    timestampCreated: "2025-11-02T09:00:00Z",
    timestampUpdated: "2025-11-02T09:05:00Z",
  },
  {
    id: 3,
    type: "Issue",
    ownerRole: "PM",
    status: "In Progress",
    timestampCreated: "2025-11-02T09:15:00Z",
    timestampUpdated: "2025-11-02T09:20:00Z",
  },
  {
    id: 4,
    type: "Template",
    ownerRole: "User",
    status: "Pending",
    timestampCreated: "2025-11-02T09:25:00Z",
    timestampUpdated: "2025-11-02T09:30:00Z",
  },
];

export default GovernanceStore;

/* ======================================================================
   Notes:
   • Provides sample governance data for the dashboard metrics.
   • Used by GovernanceSummary.jsx and GovernanceUtils.js.
   • Replace with live data service in Phase 4.6 A.4.
   ====================================================================== */
