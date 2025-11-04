/* ======================================================================
   METRA – GovernanceBridgeTest.jsx
   Phase 4.6 A.8 – Data Bridge Connectivity Test
   ----------------------------------------------------------------------
   Standalone diagnostic page that verifies JSON data is fetched
   correctly from GovernanceDataBridge.js and displayed on screen.
   ====================================================================== */

import React from "react";
import { useGovernanceDataBridge } from "../utils/GovernanceDataBridge";

export default function GovernanceBridgeTest() {
  const governanceData = useGovernanceDataBridge(10000);

  console.log("Bridge Test → Current data snapshot:", governanceData);

  return (
    <div
      style={{
        fontFamily: "Segoe UI, system-ui, sans-serif",
        backgroundColor: "#f9fafb",
        color: "#111",
        padding: "2rem",
      }}
    >
      <h1>Governance Data Bridge Test</h1>
      <p>Below is the live JSON feed as fetched from the bridge:</p>

      {governanceData && governanceData.length > 0 ? (
        <pre
          style={{
            textAlign: "left",
            background: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(governanceData, null, 2)}
        </pre>
      ) : (
        <p style={{ color: "#555" }}>No governance data loaded yet...</p>
      )}
    </div>
  );
}
