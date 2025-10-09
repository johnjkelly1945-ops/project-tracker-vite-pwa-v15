import { useState } from "react";
import "./App.css";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";

export default function App() {
  const [activeModule, setActiveModule] = useState("summary");

  const openModule = (module) => {
    setActiveModule(module);
  };

  const closeModule = () => {
    setActiveModule("summary");
  };

  return (
    <div className="app-container">
      {activeModule === "summary" && (
        <div className="summary">
          <h1>METRA</h1>
          <p>Monitor open modules and control their windows.</p>
          <div className="module-buttons">
            <button onClick={() => openModule("preproject")}>PreProject</button>
            <button onClick={() => openModule("progress")}>Progress</button>
            <button onClick={() => openModule("personnel")}>Personnel</button>
            <button onClick={() => openModule("closure")}>Closure</button>
          </div>
        </div>
      )}

      {activeModule === "preproject" && (
        <PreProject closeModule={closeModule} />
      )}

      {activeModule === "progress" && <Progress closeModule={closeModule} />}

      {activeModule === "personnel" && <Personnel closeModule={closeModule} />}

      {activeModule === "closure" && <Closure closeModule={closeModule} />}
    </div>
  );
}
