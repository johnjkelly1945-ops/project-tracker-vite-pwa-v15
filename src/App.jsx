/* ======================================================================
   METRA – App.jsx
   Phase 4.6 A.8 Step 3 – Verified Integration
   ----------------------------------------------------------------------
   Entry point loading the GovernanceProgrammeDashboard.
   Removes legacy useGovernanceDataBridge hook.
   ====================================================================== */

import React from "react";
import GovernanceProgrammeDashboard from "./components/GovernanceProgrammeDashboard";
import "./Styles/GovernanceProgrammeDashboard.css";

const App = () => {
  return (
    <div className="app-container">
      <GovernanceProgrammeDashboard />
    </div>
  );
};

export default App;
