/* ======================================================================
   METRA – main.jsx
   Clean Baseline v4.6B.12
   Stage 280 — Global Register Reveal Mount (INSPECTION-ONLY)
   ====================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import RegisterRevealLayer from "./components/registers/RegisterRevealLayer.jsx";
import "./index.css";   // ← RESTORED GLOBAL STYLES

/* ======================================================================
   STAGE 399B — PERSISTENCE CONTEXT GUARD (NON-INVASIVE)
   ====================================================================== */

const STORAGE_CONTEXT = "baseline-2026-03-17-stage398";

try {
  const stored = localStorage.getItem("metra:context");

  if (stored !== STORAGE_CONTEXT) {
    console.log("METRA: Clearing stale storage (context mismatch)");
    localStorage.clear();
    localStorage.setItem("metra:context", STORAGE_CONTEXT);
  }
} catch (e) {
  console.warn("METRA: Storage context check failed", e);
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <RegisterRevealLayer />
  </React.StrictMode>
);
