/* ============================================================================
   METRA – App.jsx
   v6.1 – Repository Mode Wiring (PreProjectFooter → DualPane → App)
   ========================================================================= */

import React, { useState } from "react";
import DualPane from "./components/DualPane.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TemplateLinks from "./components/TemplateLinks.jsx";

import "./Styles/App.v2.css";
import "./Styles/DualPane.css";
import "./Styles/FilterBar.css";

export default function App() {
  /* ------------------------------------------------------------
     MODE: "preproject" | "repository"
  ------------------------------------------------------------ */
  const [mode, setMode] = useState("preproject");

  const showPreProject = () => setMode("preproject");
  const showRepository = () => setMode("repository");

  return (
    <div className="app-container">

      {/* ------------------------------------------------------------
          GLOBAL HEADER
      ------------------------------------------------------------ */}
      <header className="global-header">
        METRA – PreProject
      </header>

      {/* ------------------------------------------------------------
          FILTER BAR (hidden in repository mode)
      ------------------------------------------------------------ */}
      {mode === "preproject" && (
        <div className="filter-bar-container">
          <FilterBar />
        </div>
      )}

      {/* ------------------------------------------------------------
          MAIN WORKSPACE
      ------------------------------------------------------------ */}
      {mode === "preproject" && (
        <DualPane
          onViewRepository={showRepository}
        />
      )}

      {/* ------------------------------------------------------------
          REPOSITORY MODE
      ------------------------------------------------------------ */}
      {mode === "repository" && (
        <div className="repository-wrapper">
          <div className="repository-return-bar">
            <button
              className="repository-return-btn"
              onClick={showPreProject}
            >
              ← Back to PreProject Workspace
            </button>
          </div>

          <div className="repository-content">
            <TemplateLinks />
          </div>
        </div>
      )}

    </div>
  );
}
