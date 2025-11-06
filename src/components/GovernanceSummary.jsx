/* ======================================================================
   METRA – GovernanceSummary.jsx
   Phase 4.6 B.4 – Diagnostic + Pointer Recovery
   ----------------------------------------------------------------------
   Re-enables interactivity and confirms event flow inside METRA app.
   ====================================================================== */

import React from "react";
import "../styles/GovernanceSummary.css";

export default function GovernanceSummary() {
  return (
    <div className="governance-summary">
      <h2>Governance Summary</h2>

      <p>
        Metrics should be clickable again. If pointer events are restored, this
        diagnostic overlay (bottom-right) will respond.
      </p>

      {/* === TEMPORARY CLICK DIAGNOSTIC === */}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          background: "#1565c0",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "0.8rem",
          cursor: "pointer",
          zIndex: 99999,
        }}
        onClick={(e) => {
          console.log("🟢 Click diagnostic fired from GovernanceSummary!");
          console.log("Event target:", e.target);
          alert("GovernanceSummary received a click");
          e.stopPropagation();
        }}
      >
        Test Click Zone
      </div>
    </div>
  );
}
