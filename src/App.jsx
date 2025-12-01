/* ======================================================================
   METRA – App.jsx
   v7.0 – Global Modal Layer Enabled
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ PreProject loads through DualPane
   ✔ Repository remains selectable
   ✔ Global popup layer added (ALL modals render above app)
   ====================================================================== */

import React, { useState } from "react";

import DualPane from "./components/DualPane.jsx";
import RepositoryModule from "./components/RepositoryModule.jsx";
import FilterBar from "./components/FilterBar.jsx";

import "./Styles/App.css";

export default function App() {
  const [activeModule, setActiveModule] = useState("preproject");

  return (
    <div className="app-container">

      {/* ------------------------------------------------------------
         GLOBAL HEADER
         ------------------------------------------------------------ */}
      <header className="global-header">
        <h1 className="app-title">METRA</h1>

        <div className="module-tabs">
          <button
            className={`module-btn ${
              activeModule === "preproject" ? "active" : ""
            }`}
            onClick={() => setActiveModule("preproject")}
          >
            Pre-Project
          </button>

          <button
            className={`module-btn ${
              activeModule === "repository" ? "active" : ""
            }`}
            onClick={() => setActiveModule("repository")}
          >
            Repository
          </button>
        </div>
      </header>


      {/* ------------------------------------------------------------
         FILTER BAR (only for PreProject)
         ------------------------------------------------------------ */}
      {activeModule === "preproject" && <FilterBar />}


      {/* ------------------------------------------------------------
         WORKSPACE CONTENT
         ------------------------------------------------------------ */}
      <main className="workspace">
        {activeModule === "preproject" && <DualPane />}
        {activeModule === "repository" && <RepositoryModule />}
      </main>

      {/* ============================================================
         GLOBAL POPUP LAYER (ALL modal windows render here)
         ============================================================ */}
      <div id="metra-popups"></div>

    </div>
  );
}
