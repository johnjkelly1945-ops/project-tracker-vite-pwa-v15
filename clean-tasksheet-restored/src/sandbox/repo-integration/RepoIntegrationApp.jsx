/* ======================================================================
   METRA – RepoIntegrationApp.jsx
   SANDBOX APP (Controlled Repo Import)
   ----------------------------------------------------------------------
   ✔ No global mutation
   ✔ Direct handoff to RepoIntegrationDualPane
   ✔ Sandbox-only architecture
   ====================================================================== */

import React, { useState } from "react";
import "../../Styles/App.css";

import RepoIntegrationDualPane from "./RepoIntegrationDualPane.jsx";
import TaskRepositorySandbox from "../../components/TaskRepositorySandbox.jsx";
import { ToastProvider } from "../../components/GlobalToast.jsx";

export default function RepoIntegrationApp() {

  const [showRepository, setShowRepository] = useState(false);
  const [repoPayload, setRepoPayload] = useState(null);

  /* --------------------------------------------------------------
     HANDLE PAYLOAD FROM REPOSITORY (SANDBOX)
     -------------------------------------------------------------- */
  const handleRepoImport = (payload) => {
    console.log("📤 Sandbox App received repo payload:", payload);

    // Store payload locally and hand off via props
    setRepoPayload(payload);

    setShowRepository(false);
  };

  return (
    <ToastProvider>
      <div className="app-container">

        {/* HEADER --------------------------------------------------- */}
        <header className="global-header">
          <h1 className="app-title">METRA Sandbox Workspace</h1>

          <div className="header-buttons">
            <button
              className="header-btn"
              onClick={() => setShowRepository(true)}
            >
              Repository (Sandbox)
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE ------------------------------------------- */}
        <RepoIntegrationDualPane repoPayload={repoPayload} />

        {/* REPOSITORY POPUP ------------------------------------------ */}
        {showRepository && (
          <TaskRepositorySandbox
            onClose={() => setShowRepository(false)}
            onAddToWorkspace={handleRepoImport}
          />
        )}

      </div>
    </ToastProvider>
  );
}
