/* ======================================================================
   METRA – App.jsx
   Phase 6.2b – DualPane Reintegration Shell
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Restores full DualPane layout (Management + Development)
   ✔ Removes temporary single-pane workspace
   ✔ Provides clean header & filter bar
   ✔ PreProject now drives task streams to both panes
   ✔ No repository routing in this phase
   ====================================================================== */

import React from "react";
import ModuleHeader from "./components/ModuleHeader.jsx";
import FilterBar from "./components/FilterBar.jsx";
import DualPane from "./components/DualPane.jsx";
import PreProject from "./components/PreProject.jsx";

import "./Styles/App.css";

export default function App() {
  console.log(">>> App.jsx – DualPane Reintegration Mode");

  /* -------------------------------------------------------------------
     PreProject remains the logic core:
     - Loads tasks
     - Filters tasks
     - Handles assignment, status updates, etc.
     - Derives mgmt/dev task arrays for the DualPane
     ------------------------------------------------------------------- */

  return (
    <div className="app-root">

      {/* Global Header */}
      <ModuleHeader />

      {/* PreProject Filter Bar (sticky, positioned above DualPane) */}
      <FilterBar />

      {/* Main Workspace: DualPane fed from PreProject */}
      <div className="module-container">
        <PreProject layout="dual" />
      </div>
    </div>
  );
}
