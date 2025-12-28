import { useState } from "react";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";

/*
=====================================================================
METRA — App.jsx
Workspace Task Instantiation — Session-Only Enablement
---------------------------------------------------------------------
• App remains authoritative owner of workspace state
• PreProject is the execution surface
• Dev-only activation point for task presence
• Exactly one task, session-only, in-memory
• No persistence
=====================================================================
*/

export default function App() {
  // Authoritative workspace state (session-only)
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  function handleAddSummary(title) {
    if (!title || !title.trim()) return;

    const newSummary = {
      id: crypto.randomUUID(),
      title: title.trim()
    };

    setSummaries(prev => [...prev, newSummary]);
  }

  /* -------------------------------------------------
     DEV-ONLY: Workspace task instantiation
     ------------------------------------------------- */
  function handleInstantiateSessionTask() {
    if (tasks.length > 0) return;

    const sessionTask = {
      id: crypto.randomUUID(),
      title: "Session Task (dev)",
      notes: [],
      status: "active"
    };

    setTasks([sessionTask]);
  }

  const headerRightButtons = [];

  if (import.meta.env.DEV) {
    headerRightButtons.push({
      label: "Instantiate session task (dev)",
      onClick: handleInstantiateSessionTask,
      disabled: tasks.length > 0
    });
  }

  return (
    <>
      <ModuleHeader rightButtons={headerRightButtons} />
      <PreProject
        tasks={tasks}
        summaries={summaries}
        onAddSummary={handleAddSummary}
      />
    </>
  );
}
