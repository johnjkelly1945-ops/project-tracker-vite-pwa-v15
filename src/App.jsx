import { useState } from "react";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";
import Progress from "./components/Progress";
import Personnel from "./components/Personnel";
import Closure from "./components/Closure";

/*
=====================================================================
METRA — App.jsx
Stage 24 (Diagnostic / Support)
---------------------------------------------------------------------
• Authoritative workspace owner
• DEV-ONLY task instantiation bridge
• No persistence
• No popup auto-open
• No semantics / governance / timing
=====================================================================
*/

export default function App() {
  const [activeModule, setActiveModule] = useState("PreProject");

  // Authoritative workspace state (session-only)
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  /* -------------------------------------------------
     DEV ONLY — Force task instantiation
     ------------------------------------------------- */
  function instantiateDevTask() {
    const task = {
      id: crypto.randomUUID(),
      title: "Session Task (dev)",
      summaryId: null
    };

    setTasks(prev => [...prev, task]);
  }

  /* -------------------------------------------------
     Summary creation
     ------------------------------------------------- */
  function handleAddSummary(title) {
    if (!title || !title.trim()) return;

    setSummaries(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: title.trim() }
    ]);
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
        rightButtons={[
          {
            label: "Instantiate session task (dev)",
            onClick: instantiateDevTask
          }
        ]}
      />
      {renderActiveModule()}
    </>
  );
}
