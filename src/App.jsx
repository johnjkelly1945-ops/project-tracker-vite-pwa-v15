/* ======================================================================
   METRA – App.jsx
   Sandbox Switch Version
   ----------------------------------------------------------------------
   • Keeps the main (stable) TaskRepository fully intact
   • Adds a temporary button to open TaskRepositorySandbox.jsx
   • No changes to any other component
   ====================================================================== */

import React, { useState } from "react";
import "./Styles/App.css";

import DualPane from "./components/DualPane.jsx";
import TaskRepository from "./components/TaskRepository.jsx";           // stable
import TaskRepositorySandbox from "./components/TaskRepositorySandbox.jsx"; // sandbox

export default function App() {
  const [showRepo, setShowRepo] = useState(false);            // stable repo popup
  const [showSandboxRepo, setShowSandboxRepo] = useState(false); // sandbox popup

  return (
    <div className="app-container">

      {/* ================================================================
          GLOBAL HEADER
      ================================================================ */}
      <header className="global-header">
        <h1 className="app-title">METRA Workspace</h1>

        <div className="header-buttons">
          {/* Stable Repository Button */}
          <button
            className="header-btn"
            onClick={() => setShowRepo(true)}
          >
            Repository (Stable)
          </button>

          {/* Sandbox Repository Button */}
          <button
            className="header-btn"
            onClick={() => setShowSandboxRepo(true)}
          >
            Repository (Sandbox)
          </button>
        </div>
      </header>

      {/* ================================================================
          MAIN WORKSPACE AREA
      ================================================================ */}
      <DualPane />

      {/* ================================================================
          POPUPS – Stable Repository
      ================================================================ */}
      {showRepo && (
        <TaskRepository
          onClose={() => setShowRepo(false)}
          onAddToWorkspace={(items) => {
            console.log("Imported from STABLE repo:", items);
            setShowRepo(false);
          }}
        />
      )}

      {/* ================================================================
          POPUPS – Sandbox Repository
      ================================================================ */}
      {showSandboxRepo && (
        <TaskRepositorySandbox
          onClose={() => setShowSandboxRepo(false)}
          onAddToWorkspace={(items) => {
            console.log("Imported from SANDBOX repo:", items);
            setShowSandboxRepo(false);
          }}
        />
      )}
    </div>
  );
}
