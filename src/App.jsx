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

Stage 38 — Workspace UI-State (Ephemeral)
---------------------------------------------------------------------
• Owner UI focus (in-memory, fail-closed)
• Summary-relative expand/collapse (visibility only)
• UI-state only — no behaviour yet
=====================================================================
*/

export default function App() {
  const [activeModule, setActiveModule] = useState("PreProject");

  // Authoritative workspace state (session-only)
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);

  // -------------------------------------------------
  // Stage 38 — Ephemeral workspace UI state (fail-closed)
  // -------------------------------------------------
  // UI focus indicator (owner-only, later stages)
  const [focusedSummaryId, setFocusedSummaryId] = useState(null);

  // Visibility toggle for tasks aligned to summaries
  // (UI-only, non-persistent)
  const [collapsedSummaryIds, setCollapsedSummaryIds] = useState(
    () => new Set()
  );

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
