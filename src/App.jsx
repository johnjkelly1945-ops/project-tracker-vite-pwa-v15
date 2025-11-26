/* ======================================================================
   METRA – App.jsx
   Version: v6.2 – Clean Shell (No DualPane, No Legacy Footer)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Provides a clean module wrapper during v6.2 reintegration
   ✔ Removes old dual-pane layout contamination
   ✔ Ensures no second footer appears
   ✔ Keeps routing simple: PreProject + Repository
   ✔ Ready for reinsertion into DualPane once stable
   ====================================================================== */

import React, { useState } from "react";
import PreProject from "./components/PreProject.jsx";
import RepositoryModule from "./components/RepositoryModule.jsx";
import ModuleHeader from "./components/ModuleHeader.jsx";
import FilterBar from "./components/FilterBar.jsx";

import "./Styles/App.css";   /* OPTIONAL – depends on your setup */

export default function App() {
  const [activeModule, setActiveModule] = useState("preproject");

  /* -------------------------------------------------------------------
     Switch top-level module cleanly
     ------------------------------------------------------------------- */
  const loadPreProject = () => setActiveModule("preproject");
  const loadRepository = () => setActiveModule("repository");

  return (
    <div className="app-root">

      {/* ================================================================
           Global Header
         ================================================================ */}
      <ModuleHeader
        loadPreProject={loadPreProject}
        loadRepository={loadRepository}
      />

      {/* ================================================================
           Filter Bar (active in PreProject only)
         ================================================================ */}
      {activeModule === "preproject" && <FilterBar />}

      {/* ================================================================
           MODULE BODY (standalone for now)
         ================================================================ */}
      <div className="module-container">

        {activeModule === "preproject" && (
          <PreProject />
        )}

        {activeModule === "repository" && (
          <RepositoryModule />
        )}

      </div>
    </div>
  );
}
