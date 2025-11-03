/* ======================================================================
   METRA – App.jsx
   Phase 4.6 A.7 Step 1 – Programme Roll-Up Dashboard Integration
   ----------------------------------------------------------------------
   This App file temporarily mounts the new Programme Roll-Up Dashboard
   for standalone verification of layout, scroll behaviour, and styling.
   Later phases will reintegrate it into the Governance navigation flow.
   ====================================================================== */

import React from "react";
import GovernanceProgrammeDashboard from "./components/GovernanceProgrammeDashboard";
import "./styles/GovernanceProgrammeDashboard.css";

/* ======================================================================
   Root Application Mount
   ====================================================================== */
function App() {
  return (
    <div className="metra-root">
      <GovernanceProgrammeDashboard />
    </div>
  );
}

export default App;
