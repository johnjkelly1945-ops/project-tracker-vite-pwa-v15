import "./Styles/App.css";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";
import { useState } from "react";

export default function App() {
  const [activeModule, setActiveModule] = useState("summary");

  // Switch between modules
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

  return (
    <div className="app-container">
      {/* === Top Header Bar === */}
      <div className="header-bar">
        <button onClick={() => setActiveModule("summary")}>
          Return to Summary
        </button>
      </div>

      {/* === Main Display Area === */}
      <div className="main-content">{renderModule()}</div>
    </div>
  );
}
