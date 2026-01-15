// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGES
---------------------------------------------------------------------
Stage 97.3    — Task ↔ Summary Reassignment
Stage 104.2   — Summary Activation Controls
Stage 104.3.A — Summary Ordering State & Data
Stage 104.3.B — Footer Wiring (Authority Completion)
Stage 106.1B  — Summary Removal (Logic Only)
Stage 130.A   — Dual Workspace Render Activation (TEMPORARY)
Stage 130.A2  — Behaviour Preservation Bridging (PARITY RESTORE)
Stage 130.B   — Pane Visibility Gating (LOCKED)
Stage 130.C   — Visibility-Only Correction (Single Working Surface)
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import PreProject from "./components/PreProject";
import DualPane from "./components/DualPane";
import ModuleHeader from "./components/ModuleHeader";
import TaskPopup from "./components/TaskPopup";

/* ===================================================================
STAGE 130 — DUAL WORKSPACE DEFAULT
----------------------------------------------------------------------
• Dual-pane is the default workspace model
• ONLY ONE working surface is rendered at any time
• Non-active pane is NOT visible
• Sidebar remains present
=================================================================== */
const STAGE_130_DUAL_WORKSPACE = true;

export default function App() {
  /* ===================== WORKSPACE STATE ===================== */
  const [workspaceState, setWorkspaceState] = useState(() => ({
    summaries: [],
    tasks: [],
  }));

  /* ===================== SUMMARY ORDER ===================== */
  const [summaryOrder, setSummaryOrder] = useState([]);

  const [activeTask, setActiveTask] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  /* ===================== TASK CREATION ===================== */

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

  /* ===================== SUMMARY CREATION ===================== */

  function handleAddSummary(title) {
    const trimmed = typeof title === "string" ? title.trim() : "";
    const id = crypto.randomUUID();

    setWorkspaceState((prev) => ({
      ...prev,
      summaries: [
        ...prev.summaries,
        {
          id,
          title: trimmed || `Summary ${prev.summaries.length + 1}`,
        },
      ],
    }));

    setSummaryOrder((prev) => [...prev, id]);
  }

  /* ===================== SUMMARY REMOVAL ===================== */

  function handleRemoveSummary(summaryId) {
    if (!summaryId) return;

    setWorkspaceState((prev) => ({
      summaries: prev.summaries.filter((s) => s.id !== summaryId),
      tasks: prev.tasks.map((t) =>
        t.summaryId === summaryId ? { ...t, summaryId: null } : t
      ),
    }));

    setSummaryOrder((prev) => prev.filter((id) => id !== summaryId));
  }

  /* ===================== SUMMARY ORDERING ===================== */

  function moveActiveSummary(activeSummaryId, direction) {
    if (!activeSummaryId) return;

    setSummaryOrder((prev) => {
      const index = prev.indexOf(activeSummaryId);
      if (index === -1) return prev;

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  /* ===================== TASK ↔ SUMMARY MOVE ===================== */

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

  /* ===================== TASK POPUP ===================== */

  function handleOpenTask(task) {
    setActiveTask(task);
  }

  function handleCloseTask() {
    setActiveTask(null);
  }

  /* ===================== DERIVED ORDER ===================== */

  const orderedSummaries =
    summaryOrder.length > 0
      ? summaryOrder
          .map((id) =>
            workspaceState.summaries.find((s) => s.id === id)
          )
          .filter(Boolean)
      : workspaceState.summaries;

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <div style={{ flex: 1 }}>
          {STAGE_130_DUAL_WORKSPACE ? (
            <DualPane
              left={
                <PreProject
                  summaries={orderedSummaries}
                  tasks={workspaceState.tasks}
                  onOpenTask={handleOpenTask}
                  onCreateTaskIntent={handleCreateTaskIntent}
                  onAddSummary={handleAddSummary}
                  moveActiveSummary={moveActiveSummary}
                  onRemoveSummary={handleRemoveSummary}
                />
              }
              right={null}
            />
          ) : (
            <PreProject
              summaries={orderedSummaries}
              tasks={workspaceState.tasks}
              onOpenTask={handleOpenTask}
              onCreateTaskIntent={handleCreateTaskIntent}
              onAddSummary={handleAddSummary}
              moveActiveSummary={moveActiveSummary}
              onRemoveSummary={handleRemoveSummary}
            />
          )}

          {activeTask && (
            <TaskPopup
              task={activeTask}
              summaries={orderedSummaries}
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
