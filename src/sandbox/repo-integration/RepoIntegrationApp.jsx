/* ======================================================================
   METRA – RepoIntegrationApp.jsx
   Stage-3A Sandbox Wrapper
   ----------------------------------------------------------------------
   PURPOSE:
   • Standalone environment for safe Repository → Workspace integration
   • Loads RepoIntegrationDualPane.jsx only (NOT the main METRA Workspace)
   • Provides a clean header with a button to open the Repository Sandbox
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import RepoIntegrationDualPane from "./RepoIntegrationDualPane.jsx";
import TaskRepositorySandbox from "./TaskRepositorySandbox.jsx";

export default function RepoIntegrationApp() {

  const [showRepo, setShowRepo] = useState(false);

  return (
    <div className="repo-integration-app">

      {/* === SIMPLE HEADER ======================================== */}
      <div className="repo-integration-header"
           style={{ display: "flex", justifyContent: "space-between",
                    padding: "12px 20px", background:"#f0f4fa",
                    borderBottom:"1px solid #d0d7e2" }}>
        <h1 style={{ margin: 0, fontSize: "20px" }}>
          METRA – Repository Integration Sandbox
        </h1>

        <button
          onClick={() => setShowRepo(true)}
          style={{
            padding: "8px 14px",
            background: "#0b4b85",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Open Repository
        </button>
      </div>

      {/* === MAIN SANDBOX WORKSPACE ================================= */}
      <RepoIntegrationDualPane />

      {/* === REPOSITORY POPUP (SANDBOX VERSION) ===================== */}
      {showRepo && createPortal(
        <TaskRepositorySandbox
          onClose={() => setShowRepo(false)}
          onImport={(data) => {
            window.dispatchEvent(
              new CustomEvent("repoIntegrationImport", { detail: data })
            );
            setShowRepo(false);
          }}
        />,
        document.getElementById("metra-popups")
      )}
    </div>
  );
}
