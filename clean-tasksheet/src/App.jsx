/* ======================================================================
   METRA – App.jsx (FULL REPLACEMENT)
   Step 7G Fix – Proper Repository → PreProject Task Injection
   ====================================================================== */

import React, { useState } from "react";
import PreProject from "./components/PreProject";
import RepositoryModule from "./components/RepositoryModule";
import "./Styles/PreProject.css";

export default function App() {
  const [screen, setScreen] = useState("preproject");

  /* ================================================================
     Hold tasks passed back from Repository
     ================================================================ */
  const [repoTasks, setRepoTasks] = useState([]);

  /* ================================================================
     Receive tasks from Repository and return to PreProject
     ================================================================ */
  const handleDownload = (items) => {
    setRepoTasks(items);     // store tasks for PreProject
    setScreen("preproject"); // return to workspace
  };

  /* ================================================================
     Clear after PreProject has merged them
     ================================================================ */
  const clearInjectedTasks = () => {
    setRepoTasks([]);
  };

  /* ================================================================
     SCREEN ROUTER
     ================================================================ */
  return (
    <>
      {screen === "preproject" && (
        <PreProject
          setScreen={setScreen}
          injectedTasks={repoTasks}
          clearInjectedTasks={clearInjectedTasks}
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
