/* ======================================================================
   METRA – App.jsx
   Navigation Bar + Screen Switching
   ====================================================================== */

import React, { useState } from "react";

import NavBar from "./components/NavBar";
import PreProjectDual from "./components/PreProjectDual";
import RepositoryModule from "./components/RepositoryModule";



export default function App() {
  const [screen, setScreen] = useState("preproject");
  const [repoTasks, setRepoTasks] = useState([]);

  const handleDownload = (items) => {
    setRepoTasks(items);
    setScreen("preproject");
  };

  const clearInjectedTasks = () => setRepoTasks([]);

  return (
    <div className="app-root">
      <NavBar setScreen={setScreen} />

      {screen === "preproject" && (
        <PreProjectDual
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
    </div>
  );
}
