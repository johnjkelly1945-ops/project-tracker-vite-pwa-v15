/* ======================================================================
   METRA – App.jsx
   Phase 4.6 A.8 Step 2 – Verified Live Governance Feed (Stable Baseline)
   ----------------------------------------------------------------------
   Connects the Governance Programme Dashboard to the live data feed.
   Verified for Safari 18.5 – stable scroll and filter layout.
   ====================================================================== */

import React from "react";
import GovernanceProgrammeDashboard from "./components/GovernanceProgrammeDashboard";
import { useGovernanceDataBridge } from "./utils/GovernanceDataBridge"; // ✅ corrected path
import "./App.css";

/* ======================================================================
   Component Definition
   ====================================================================== */
export default function App() {
  // 🔹 Get live data every 10 seconds
  const governanceData = useGovernanceDataBridge(10000);

  return (
    <div className="metra-root">
      {/* ---------------------------------------------------------------
         METRA – Governance Programme Roll-Up Dashboard
         --------------------------------------------------------------- */}
      <GovernanceProgrammeDashboard governanceData={governanceData} />
    </div>
  );
}
