import { useState } from "react";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";

/*
=====================================================================
METRA — App.jsx
Stage 21.3.A — Workspace Owner Introduced
---------------------------------------------------------------------
• App is authoritative owner of workspace state
• Owns tasks and summaries
• Exposes summary-creation handler
• No persistence yet (session-only)
• No task creation yet
• No activation / assignment changes
=====================================================================
*/

export default function App() {
  const [activeModule, setActiveModule] = useState("PreProject");

  // Authoritative workspace state (session-only for now)
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  /* -------------------------------------------------
     Summary creation (PM-by-convention; enforcement deferred)
     ------------------------------------------------- */
  function handleAddSummary(title) {
    if (!title || !title.trim()) return;

    const newSummary = {
      id: crypto.randomUUID(),
      title: title.trim()
    };

    // Append to bottom
    setSummaries(prev => [...prev, newSummary]);
  }

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
        return (
          <PreProject
            tasks={tasks}
            summaries={summaries}
            onAddSummary={handleAddSummary}
          />
        );
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
