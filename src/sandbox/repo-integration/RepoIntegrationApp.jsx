/* ======================================================================
   METRA – RepoIntegrationApp.jsx
   FINAL SANDBOX REPOSITORY LAUNCHER (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Opens repository sandbox popup
   ✔ Receives repo export payload
   ✔ Forwards payload to DualPane via global bridge
   ✔ No DOM events
   ✔ Clean, stable, isolated from main METRA app
   ====================================================================== */

import React, { useState } from "react";
import "../../Styles/App.css";

import RepoIntegrationDualPane from "./RepoIntegrationDualPane.jsx";
import TaskRepositorySandbox from "../../components/TaskRepositorySandbox.jsx";

export default function RepoIntegrationApp() {

  const [showRepository, setShowRepository] = useState(false);

  /* --------------------------------------------------------------
     HANDLE PAYLOAD FROM REPOSITORY
     -------------------------------------------------------------- */
  const handleRepoImport = (payload) => {
    console.log("📤 Sandbox App received repo payload:", payload);

    if (typeof window.onRepoImportToDualPane === "function") {
      window.onRepoImportToDualPane(payload);
    } else {
      console.warn("⚠️ RepoIntegrationDualPane listener not ready.");
    }

    setShowRepository(false);
  };

  return (
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
      <RepoIntegrationDualPane />

      {/* REPOSITORY POPUP ------------------------------------------ */}
      {showRepository && (
        <TaskRepositorySandbox
          onClose={() => setShowRepository(false)}
          onAddToWorkspace={handleRepoImport}
        />
      )}

    </div>
  );
}
