/* ======================================================================
   METRA – App.jsx
   Unified Repository Integration (Dec 2025)
   ----------------------------------------------------------------------
   ✔ One Repository button only
   ✔ Opens TaskRepositorySandbox as the official repo
   ✔ Receives repo export payload
   ✔ Forwards payload to DualPane through global bridge
   ✔ No impact to existing components or layout
   ====================================================================== */

import React, { useState } from "react";
import "./Styles/App.css";

import DualPane from "./components/DualPane.jsx";
import TaskRepositorySandbox from "./components/TaskRepositorySandbox.jsx";

export default function App() {

  const [showRepository, setShowRepository] = useState(false);

  /* ================================================================
     HANDLE REPOSITORY IMPORT
     ================================================================ */
  const handleRepoImport = (payload) => {
    console.log("📤 App received repo payload:", payload);

    // Deliver payload into DualPane via the bridge defined inside DualPane.jsx
    if (typeof window.onRepoImportToDualPane === "function") {
      window.onRepoImportToDualPane(payload);
    } else {
      console.warn("⚠️ DualPane listener not ready.");
    }

    setShowRepository(false);
  };

  return (
    <div className="app-container">

      {/* ============================================================
          GLOBAL HEADER
      ============================================================ */}
      <header className="global-header">
        <h1 className="app-title">METRA Workspace</h1>

        <div className="header-buttons">
          <button
            className="header-btn"
            onClick={() => setShowRepository(true)}
          >
            Repository
          </button>
        </div>
      </header>

      {/* ============================================================
          MAIN WORKSPACE
      ============================================================ */}
      <DualPane />

      {/* ============================================================
          POPUP – Unified Repository (Sandbox)
      ============================================================ */}
      {showRepository && (
        <TaskRepositorySandbox
          onClose={() => setShowRepository(false)}

          // The Sandbox Repo will call this with:
          // { summaries: [...], bundles: [...], tasks: [...], type: "Mgmt" | "Dev" }
          onAddToWorkspace={handleRepoImport}
        />
      )}

    </div>
  );
}
