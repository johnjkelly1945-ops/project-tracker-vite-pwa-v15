/* ======================================================================
   METRA – App.jsx
   Updated to use RepositoryModule (new filename to break Safari cache)
   ====================================================================== */

import React, { useState } from "react";
import PreProject from "./components/PreProject";
import RepositoryModule from "./components/RepositoryModule";
import "./Styles/PreProject.css";

export default function App() {
  const [screen, setScreen] = useState("preproject");

  /* ================================================================
     Handle tasks returned from Repository (Summaries + Tasks)
     ================================================================ */
  const handleDownload = (newTasks) => {
    // Store downloaded tasks so PreProject can retrieve them
    localStorage.setItem("repo_downloaded_tasks", JSON.stringify(newTasks));
    setScreen("preproject");
  };

  /* ================================================================
     SCREEN ROUTER
     ================================================================ */
  return (
    <>
      {screen === "preproject" && (
        <PreProject
          setScreen={setScreen}
        />
      )}

      {screen === "repository" && (
        <RepositoryModule
          setScreen={setScreen}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
