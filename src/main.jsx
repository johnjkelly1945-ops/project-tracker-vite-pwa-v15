/* ======================================================================
   METRA – Root Mount (Phase 4.6 A.3C Governance Summary Test)
   ----------------------------------------------------------------------
   Temporarily mounts the Governance Summary Dashboard in place of
   PreProject so the live data integration can be verified.
   ====================================================================== */

import React from "react";
import ReactDOM from "react-dom/client";
import { RoleProvider } from "./context/RoleContext.jsx";   // Global role context
import GovernanceSummary from "./components/GovernanceSummary.jsx"; // 🆕 New dashboard
import "./index.css"; // Keep existing global styles

// ----------------------------------------------------------------------
// 🟩 Root Render (Governance Summary Test Mount)
// ----------------------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RoleProvider>
      <GovernanceSummary />
    </RoleProvider>
  </React.StrictMode>
);

// ----------------------------------------------------------------------
// 🧩 Notes
// ----------------------------------------------------------------------
// • This temporarily replaces <PreProject /> with <GovernanceSummary />.
// • Use it to verify that the live dashboard renders correctly in Safari,
//   updates metrics, and refreshes automatically every 5 minutes.
// • When verified and baselined, restore <PreProject /> as root mount.
// ======================================================================
