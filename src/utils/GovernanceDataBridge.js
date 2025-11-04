/* ======================================================================
   METRA – GovernanceDataBridge.js
   Phase 4.6 A.8 Step 2A (Verified Stable Build)
   ====================================================================== */

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
