/* ======================================================================
   METRA – App.jsx
   Phase 4.6 B.6 – Drill-Down Verification Environment
   ----------------------------------------------------------------------
   Loads the GovernanceProgrammeDashboard_B6Test component directly.
   Console output and click events confirmed working.
   ====================================================================== */

import React from "react";
import GovernanceProgrammeDashboard_B6Test from "./components/GovernanceProgrammeDashboard_B6Test";

export default function App() {
  console.log("✅ METRA – Phase 4.6 B.6 Test Build Active");
  return (
    <div className="app-container">
      <GovernanceProgrammeDashboard_B6Test />
    </div>
  );
}
