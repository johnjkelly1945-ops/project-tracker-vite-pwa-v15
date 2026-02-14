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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <RegisterRevealLayer />
  </React.StrictMode>
);
