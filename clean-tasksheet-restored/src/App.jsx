/* ======================================================================
   METRA – App.jsx
   Stage 1 Dual Pane Shell (50/50 Layout)
   ----------------------------------------------------------------------
   Loads PreProjectDual, which contains the dual-pane scaffolding.
   No logic, no filters, no scroll state yet.
   ====================================================================== */

import React from "react";
import PreProjectDual from "./components/PreProjectDual";
import "./Styles/App.v2.css";
import "./Styles/DualPane.css";

export default function App() {
  return (
    <div className="app-container">
      <PreProjectDual />
    </div>
  );
}
