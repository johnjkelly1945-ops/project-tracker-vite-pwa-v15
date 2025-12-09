/* ======================================================================
   METRA – App_SANDBOX.jsx
   Entry Point for Repository Integration Sandbox
   ----------------------------------------------------------------------
   PURPOSE:
   • Loads ONLY the RepoIntegrationApp (the sandbox environment)
   • Keeps your main METRA Workspace completely untouched
   • Allows safe testing of Repository → Workspace import logic
   ====================================================================== */

import React from "react";
import RepoIntegrationApp from "./sandbox/repo-integration/RepoIntegrationApp.jsx";

export default function App_SANDBOX() {
  return (
    <div className="metra-sandbox-container">
      <RepoIntegrationApp />
    </div>
  );
}
