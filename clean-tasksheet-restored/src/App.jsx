/* ======================================================================
   METRA – App.jsx
   Stage 5.3 – DualPane Interaction Restore
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Keep global header stable
   ✔ Keep filter bar visible
   ✔ Render DualPane with working portals
   ✔ Restore task interaction safely
   ✔ NO layout or scroll changes yet
   ====================================================================== */

import React from "react";
import DualPane from "./components/DualPane.jsx";
import FilterBar from "./components/FilterBar.jsx";

import "./Styles/App.v2.css";
import "./Styles/DualPane.css";
import "./Styles/FilterBar.css";

export default function App() {
  return (
    <div className="app-container">

      {/* === Global Main Header (sticky) === */}
      <header className="global-header">
        METRA – PreProject
      </header>

      {/* === Filter Bar (shared) === */}
      <FilterBar />

      {/* === DualPane workspace === */}
      <DualPane />

      {/* === GLOBAL PORTAL ROOT (REQUIRED) === */}
      <div id="metra-popups"></div>

    </div>
  );
}
