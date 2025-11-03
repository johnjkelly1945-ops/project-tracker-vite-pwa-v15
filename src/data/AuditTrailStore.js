/* ======================================================================
   METRA – AuditTrailStore.js
   Phase 4.6 A.3C – Data Integration
   ----------------------------------------------------------------------
   Temporary local audit log entries for the Governance Summary dashboard.
   ====================================================================== */

const AuditTrailStore = [
  {
    id: 1,
    user: "Admin",
    action: "Approved Change Request",
    governanceType: "Change Control",
    refID: "CC-001",
    timestampCreated: "2025-11-02T09:45:00Z",
  },
  {
    id: 2,
    user: "PMO",
    action: "Reviewed Risk Entry",
    governanceType: "Risk",
    refID: "RISK-101",
    timestampCreated: "2025-11-02T10:00:00Z",
  },
  {
    id: 3,
    user: "PM",
    action: "Updated Issue status",
    governanceType: "Issue",
    refID: "ISS-007",
    timestampCreated: "2025-11-02T10:15:00Z",
  },
];

export default AuditTrailStore;

/* ======================================================================
   Notes:
   • Provides sample audit entries for ActivityStream.
   • Sorted by timestamp in AuditUtils.js.
   • Replace with persistent audit service in later phase.
   ====================================================================== */
