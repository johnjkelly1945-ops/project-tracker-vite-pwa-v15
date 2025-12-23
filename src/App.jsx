import { useState } from "react";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";

/*
=====================================================================
METRA — App.jsx
Stage 12.7 — Regression Correction

Summary Dashboard:
• Explicitly dormant
• Not rendered
• Not default
• Not reachable in Stage 12.x

Workspace (PreProject) is the unconditional default.
=====================================================================
*/

export default function App() {
  const [activeModule, setActiveModule] = useState("PreProject");

  function renderActiveModule() {
    switch (activeModule) {
      case "Progress":
        return <Progress />;
      case "Personnel":
        return <Personnel />;
      case "Closure":
        return <Closure />;
      case "PreProject":
      default:
        return <PreProject />;
    }
  }

  return (
    <>
      <ModuleHeader
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      {renderActiveModule()}
    </>
  );
}
