/* =====================================================================
   METRA – Application Entry Point (Restored Normal Routing)
   ---------------------------------------------------------------------
   Phase: feature-preproject-popup-integration-phase1
   Source Baseline: baseline-2025-10-29-popup-universal-v1-stable
   ---------------------------------------------------------------------
   Purpose:
   - Restores standard app startup through App.jsx
   - Enables PreProject and other modules to load normally
   - Keeps environment stable for popup integration work
   ===================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

console.log("🚀 METRA application starting… (normal routing restored)");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("✅ App successfully mounted via App.jsx");
