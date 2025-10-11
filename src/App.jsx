import "./Styles/App.css";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";
import { useState } from "react";
import ModuleHeader from "./components/ModuleHeader";

export default function App() {
  const [activeModule, setActiveModule] = useState("summary");

  const renderModule = () => {
    switch (activeModule) {
      case "preproject":
        return <PreProject />;
      case "progress":
        return <Progress />;
      case "personnel":
        return <Personnel />;
      case "closure":
        return <Closure />;
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

  const showHeader = activeModule !== "summary";

  return (
    <div className="app-container">
      {/* 🔹 Show header only when in a module */}
      {showHeader && (
        <header className="top-header">
          <ModuleHeader
            title="Module"
            onReturn={() => setActiveModule("summary")}
            onClose={() => window.close()}
          />
        </header>
      )}

      {/* 🔹 Main display area */}
      <main className="main-content">{renderModule()}</main>
    </div>
  );
}
