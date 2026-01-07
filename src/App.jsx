// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

ROLE
---------------------------------------------------------------------
Application root and authority holder.

STAGE CONTEXT
---------------------------------------------------------------------
Stage 83.2 — Canonical workspace execution (baseline)
Stage 86.1 — Sidebar structural mount (INERT)

CHANGE SCOPE (THIS FIX)
---------------------------------------------------------------------
• Restore missing onAssignTask handler
• Preserve existing assignment behaviour
• No new behaviour introduced
• No sidebar interaction

=====================================================================
*/

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./styles/sidebar.css";

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

  /* ================= SUMMARY ================= */

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

  /* ================= TASK CREATION ================= */

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

  /* ================= TASK OPEN / CLOSE ================= */

  function handleOpenTask(task) {
    setActiveTask(task);
  }

  function handleCloseTask() {
    setActiveTask(null);
  }

  /* ================= TASK NOTES ================= */

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

  /* ================= TASK ASSIGNMENT (RESTORED CONTRACT) ================= */

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

  const resolvedActiveTask = activeTask;

  return (
    <>
      {/* =========================================================
          Sidebar — Stage 86.1 (Structural, Inert, Non-authoritative)
         ========================================================= */}
      <Sidebar />

      {/* =========================================================
          Application Root — AUTHORITATIVE
         ========================================================= */}
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
    </>
  );
}
