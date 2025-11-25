/* ============================================================================
   METRA – DualPane.jsx
   v3.9 + Repository Wiring
   ========================================================================== */

import React from "react";
import PreProject from "./PreProject.jsx";
import PreProjectFooter from "./PreProjectFooter.jsx";
import "../Styles/DualPane.css";

export default function DualPane({ onViewRepository }) {
  return (
    <div className="dual-wrapper">

      {/* Scroll Region */}
      <div className="dual-scroll-region">
        <PreProject />
      </div>

      {/* Sticky Footer */}
      <PreProjectFooter
        onAddSummary={() => {}}
        onAddTask={() => {}}
        onViewRepo={onViewRepository}
      />
    </div>
  );
}
