// @ts-nocheck
import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  const [activeTask, setActiveTask] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  /* ================= TASK CREATION ================= */

  function handleCreateTaskIntent(intent) {
    if (!intent || !intent.title) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: intent.title,
      summaryId: intent.summaryId ?? null,
      notes: [],
    };

    setWorkspaceState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    setActiveTask(newTask);
  }

  /* ================= SUMMARY CREATION (TITLE-SAFE) ================= */

  function handleAddSummary(title) {
    const trimmed = typeof title === "string" ? title.trim() : "";

    setWorkspaceState((prev) => ({
      ...prev,
      summaries: [
        ...prev.summaries,
        {
          id: crypto.randomUUID(),
          title: trimmed || `Summary ${prev.summaries.length + 1}`,
        },
      ],
    }));
  }

  /* ================= TASK ↔ SUMMARY MOVE ================= */

  function handleChangeTaskSummary(taskId, newSummaryId) {
    setWorkspaceState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? { ...t, summaryId: newSummaryId ?? null }
          : t
      ),
    }));
  }

  /* ================= TASK POPUP ================= */

  function handleOpenTask(task) {
    setActiveTask(task);
  }

  function handleCloseTask() {
    setActiveTask(null);
  }

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <div style={{ flex: 1 }}>
          <PreProject
            summaries={workspaceState.summaries}
            tasks={workspaceState.tasks}
            onOpenTask={handleOpenTask}
            onCreateTaskIntent={handleCreateTaskIntent}
            onAddSummary={handleAddSummary}
          />

          {activeTask && (
            <TaskPopup
              task={activeTask}
              summaries={workspaceState.summaries}
              onClose={handleCloseTask}
              onAddNote={() => {}}
              onAssignTask={() => {}}
              onChangeTaskSummary={handleChangeTaskSummary}
            />
          )}
        </div>
      </div>
    </>
  );
}
