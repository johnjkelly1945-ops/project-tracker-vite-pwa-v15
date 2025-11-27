/* ======================================================================
   METRA – App.jsx
   v6.3 DualPane Integration (Corrected)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Ensures PreProject always loads THROUGH DualPane
   ✔ Removes any direct <PreProject /> rendering
   ✔ Keeps Repository accessible from top navigation
   ✔ Manages global module state
   ✔ Renders FilterBar only in PreProject mode
   ====================================================================== */
/* TEST123 FROM RESTORED */

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
         FILTER BAR (only shown for PreProject)
         ------------------------------------------------------------ */}
      {activeModule === "preproject" && <FilterBar />}


      {/* ------------------------------------------------------------
         WORKSPACE CONTENT AREA
         ------------------------------------------------------------ */}
      <main className="workspace">
        {activeModule === "preproject" && <DualPane />}
        {activeModule === "repository" && <RepositoryModule />}
      </main>

    </div>
  );
}
