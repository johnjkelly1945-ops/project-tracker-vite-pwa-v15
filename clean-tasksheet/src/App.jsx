/* ======================================================================
   METRA – App.jsx
   Clean baseline with stable repository → preproject injection
   ====================================================================== */

import React, { useState } from "react";
import PreProject from "./components/PreProject";
import RepositoryModule from "./components/RepositoryModule";
import "./Styles/PreProject.css";

export default function App() {
  const [screen, setScreen] = useState("preproject");
  const [repoTasks, setRepoTasks] = useState([]);

  const handleDownload = (items) => {
    setRepoTasks(items);
    setScreen("preproject");
  };

  const clearInjectedTasks = () => setRepoTasks([]);

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
