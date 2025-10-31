/* ==========================================================
   METRA – Root Mount (Phase 4.3A Integration)
   ----------------------------------------------------------
   Wraps the entire app in the RoleProvider so that
   PreProject and all future modules can access role data.
   ========================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import PreProject from "./components/PreProject.jsx";
import { RoleProvider } from "./context/RoleContext.jsx"; // 🆕 Global role context
import "./index.css"; // (keep if already in use for global styles)

// -----------------------------------------------------------
// 🟩 Root Render
// -----------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoleProvider>
      <PreProject />
    </RoleProvider>
  </React.StrictMode>
);

// -----------------------------------------------------------
// 🧩 Notes
// -----------------------------------------------------------
// 1️⃣ RoleProvider provides {role, showGovernance, toggleGovernance, permissions} globally.
// 2️⃣ Default role = "ProjectManager" (for testing).
// 3️⃣ In Phase 4.3B, PreProject will read this context to
//     hide Governance Queue for non-Admin/PMO users.
// 4️⃣ Future: Role will link to Personnel / Login modules.
// ==========================================================
