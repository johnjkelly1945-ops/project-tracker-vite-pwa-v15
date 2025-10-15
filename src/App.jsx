import "./Styles/App.css";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";
import { useState } from "react";

export default function App() {
  const [activeModule, setActiveModule] = useState("summary");

  // === Module Switcher ===
  const renderModule = () => {
    switch (activeModule) {
      case "preproject":
        return <PreProject setActiveModule={setActiveModule} />;
      case "progress":
        return <Progress setActiveModule={setActiveModule} />;
      case "personnel":
        return <Personnel setActiveModule={setActiveModule} />;
      case "closure":
        return <Closure setActiveModule={setActiveModule} />;
      default:
        return (
          <div className="summary-screen">
            <h1>METRA – Project Tracker</h1>
            <p>Select a module to begin.</p>
            <div className="summary-buttons">
              <button onClick={() => setActiveModule("preproject")}>
                Pre-Project
              </button>
              <button onClick={() => setActiveModule("progress")}>
                Progress
              </button>
              <button onClick={() => setActiveModule("personnel")}>
                Personnel
              </button>
              <button onClick={() => setActiveModule("closure")}>
                Closure
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* === Top Header: only visible on summary screen === */}
      {activeModule === "summary" && (
        <div className="header-bar">
          <button onClick={() => setActiveModule("summary")}>
            Return to Summary
          </button>
        </div>
      )}

      {/* === Main Display === */}
      <div className="main-content">{renderModule()}</div>
    </div>
  );
}
