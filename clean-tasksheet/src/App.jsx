/* ======================================================================
   METRA – App.jsx
   Module Switching Framework (PreProject ↔ Repository)
   ----------------------------------------------------------------------
   This file controls which main screen is displayed.
   No routing library required — simple manual screen switching.
   ====================================================================== */

import React, { useState } from "react";

// Main modules
import PreProject from "./components/PreProject";
import Repository from "./components/Repository";   // NEW MODULE

// Global styles (unchanged)
import "./Styles/PreProject.css";
import "./Styles/Repository.css";                   // NEW CSS (file will follow)

export default function App() {

  /* ============================================
     Master screen controller
     --------------------------------------------
     screen = "preproject"  → Workspace (current)
     screen = "repository"  → Full screen Repository Module
  ============================================ */
  const [screen, setScreen] = useState("preproject");

  /* ============================================
     Task injection from Repository → PreProject
     --------------------------------------------
     When user downloads selected tasks from Repository,
     this callback receives an array of new tasks and
     forwards them into PreProject.
  ============================================ */
  const [injectedTasks, setInjectedTasks] = useState([]);

  const handleRepositoryDownload = (tasksFromRepo) => {
    setInjectedTasks(tasksFromRepo);
    setScreen("preproject");
  };


  /* ============================================
     RENDER SCREENS
  ============================================ */
  return (
    <div className="metra-app-shell">

      {screen === "preproject" && (
        <PreProject
          setScreen={setScreen}
          injectedTasks={injectedTasks}
          clearInjectedTasks={() => setInjectedTasks([])}
        />
      )}

      {screen === "repository" && (
        <Repository
          setScreen={setScreen}
          onDownload={handleRepositoryDownload}
        />
      )}

    </div>
  );
}
