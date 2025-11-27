/* ======================================================================
   METRA – App.jsx
   v6.3 – Restore Proper PreProject → DualPane Architecture
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ App manages only high-level module switching
   ✔ PreProject owns: tasks, scrolling, popup, dualpane
   ✔ Repository remains isolated and stable
   ✔ Cleanest and safest structure for ongoing reintegration
   ====================================================================== */

import React, { useState } from "react";

import ModuleHeader from "./components/ModuleHeader.jsx";
import FilterBar from "./components/FilterBar.jsx";

import PreProject from "./components/PreProject.jsx";
import RepositoryModule from "./components/RepositoryModule.jsx";

import "./Styles/App.css";

export default function App() {

  console.log(">>> App.jsx (v6.3 Restore PreProject)");

  /* ---------------------------------------------------------------
     MODULE SWITCHING
     --------------------------------------------------------------- */
  const [activeModule, setActiveModule] = useState("preproject");

  const loadPreProject = () => setActiveModule("preproject");
  const loadRepository = () => setActiveModule("repository");

  return (
    <div className="app-root">

      {/* ===== GLOBAL HEADER ===== */}
      <ModuleHeader
        loadPreProject={loadPreProject}
        loadRepository={loadRepository}
      />

      {/* ===== FILTER BAR (PreProject only) ===== */}
      {activeModule === "preproject" && <FilterBar />}

      {/* ===== MAIN BODY ===== */}
      <div className="module-container">

        {/* === PREPROJECT ROOT === */}
        {activeModule === "preproject" && (
          <PreProject />
        )}

        {/* === REPOSITORY === */}
        {activeModule === "repository" && (
          <RepositoryModule />
        )}

      </div>

    </div>
  );
}
