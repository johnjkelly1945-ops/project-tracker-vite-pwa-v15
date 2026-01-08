// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGE
---------------------------------------------------------------------
Stage 86.2 — Sidebar Expand / Collapse (UI-Only)

CHANGE SUMMARY
---------------------------------------------------------------------
• Preserve full App authority (tasks, summaries, popup)
• Introduce sidebarExpanded UI state
• Wrap existing application layout safely
• Zero behavioural regression permitted
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import PreProject from "./components/PreProject";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  /* ===================== WORKSPACE STATE ===================== */
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  const [focusedSummaryId, setFocusedSummaryId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  /* ===================== SIDEBAR UI STATE ===================== */
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  /* ===================== HANDLERS (AUTHORITATIVE) ===================== */

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

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 56px)",
        }}
      >
        {/* Sidebar — UI only */}
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        {/* Main application — unchanged */}
        <div className="app-root" style={{ flex: 1 }}>
          <PreProject
            summaries={workspaceState.summaries}
            tasks={workspaceState.tasks}
            onAddSummary={handleAddSummary}
            onCreateTaskIntent={handleCreateTaskIntent}
            focusedSummaryId={focusedSummaryId}
            setFocusedSummaryId={setFocusedSummaryId}
            onOpenTask={handleOpenTask}
          />

          {activeTask && (
            <TaskPopup
              task={activeTask}
              summaries={workspaceState.summaries}
              onClose={handleCloseTask}
              onAddNote={handleAddNote}
              onAssignTask={handleAssignTask}
            />
          )}
        </div>
      </div>
    </>
  );
}
