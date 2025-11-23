/* ======================================================================
   METRA – App.jsx
   Clean DualPane Integration (Restored)
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

      <header className="global-header">
        METRA – PreProject
      </header>

      {/* === Filter Bar === */}
      <div className="filter-bar-container">
        <FilterBar />
      </div>

      {/* === DualPane Workspace === */}
      <DualPane />

    </div>
  );
}
