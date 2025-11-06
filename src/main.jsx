/* =====================================================================
   METRA – main.jsx (Restored METRA App)
   ---------------------------------------------------------------------
   Reconnects the full METRA application instead of ClickTest.
   Includes one temporary global click logger for diagnostics.
   ===================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

// === Temporary global click logger (safe to remove later) ===
if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    console.log("🔹 Global click detected at:", e.clientX, e.clientY);
  });
}

// === Render full METRA application ===
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
