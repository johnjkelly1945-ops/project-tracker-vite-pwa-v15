import React, { useState } from "react";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  const [focusedSummaryId, setFocusedSummaryId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  function handleAddSummary() {
    setWorkspaceState((prev) => ({
      ...prev,
      summaries: [
        ...prev.summaries,
        {
          id: crypto.randomUUID(),
          title: `Summary ${prev.summaries.length + 1}`,
        },
      ],
    }));
  }

  function handleCreateTaskIntent(intent) {
    if (!intent || !intent.title) return;

    setWorkspaceState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: crypto.randomUUID(),
          title: intent.title,
          summaryId: intent.summaryId ?? null,
          notes: [],
        },
      ],
    }));
  }

  function handleOpenTask(task) {
    // Stage 53.1 — deliberate task-scoped invocation
    // IMPORTANT: task is already sourced from workspaceState.tasks
    setActiveTask(task);
  }

  function handleCloseTask() {
    setActiveTask(null);
  }

  function handleAddNote(taskId, noteText) {
    const timestamp = new Date().toLocaleString();
    const note = `${noteText} (${timestamp})`;

    setWorkspaceState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              notes: Array.isArray(t.notes)
                ? [...t.notes, note]
                : [note],
            }
          : t
      ),
    }));
  }

  // ================= ASSIGNMENT (AUTHORITATIVE) =================
  function handleAssignTask(taskId, assigneeId) {
    const timestamp = new Date().toLocaleString();

    setWorkspaceState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedTo: assigneeId,
              assignedAt: timestamp,
            }
          : t
      ),
    }));
  }

  /*
  =====================================================================
  FIX — REGRESSION REMOVAL (Stage 81 Recovery)
  ---------------------------------------------------------------------
  activeTask already originates from workspaceState.tasks.
  Re-resolving by ID caused popup suppression due to identity mismatch.
  =====================================================================
  */

  const resolvedActiveTask = activeTask;

  return (
    <div className="app-root">
      <ModuleHeader />

      <PreProject
        summaries={workspaceState.summaries}
        tasks={workspaceState.tasks}
        onAddSummary={handleAddSummary}
        onCreateTaskIntent={handleCreateTaskIntent}
        focusedSummaryId={focusedSummaryId}
        setFocusedSummaryId={setFocusedSummaryId}
        onOpenTask={handleOpenTask}
      />

      {resolvedActiveTask && (
        <TaskPopup
          task={resolvedActiveTask}
          summaries={workspaceState.summaries}
          onClose={handleCloseTask}
          onAddNote={handleAddNote}
          onAssignTask={handleAssignTask}
        />
      )}
    </div>
  );
}
