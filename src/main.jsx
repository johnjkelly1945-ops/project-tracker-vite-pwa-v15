/* ======================================================================
   METRA – main.jsx
   Clean Baseline v4.6B.12
   Stage 280 — Global Register Reveal Mount (INSPECTION-ONLY)
   ====================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import RegisterRevealLayer from "./components/registers/RegisterRevealLayer.jsx";
import { setActingUser } from "./domain/actor/ActingUser";

/* ================= Stage 436 — Actor Initialisation (Runtime Source) ================= */

const storedUser = JSON.parse(localStorage.getItem("metra_acting_user"));

setActingUser(
  storedUser || {
    id: "person-1774983857164",
    displayName: "Default Assignee"
  }
);

import "./index.css";   // ← RESTORED GLOBAL STYLES

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <RegisterRevealLayer />
  </React.StrictMode>
);
