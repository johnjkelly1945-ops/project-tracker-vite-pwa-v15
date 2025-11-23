/* ======================================================================
   METRA – App.jsx
   Stage 3.2 – DualPane Active Mode (Isolated Layout Testing)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Keep global header stable
   ✔ Keep filter bar visible
   ✔ Render DualPane.jsx for isolated scroll & layout debugging
   ✔ DO NOT affect PreProjectDual.jsx until DualPane is verified
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

      {/* === DualPane scaffold (ACTIVE for Stage 3.2) === */}
      <DualPane />

    </div>
  );
}
