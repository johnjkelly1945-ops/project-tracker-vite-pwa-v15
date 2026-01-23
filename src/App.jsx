// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 190 — Summary Removal (Archived, Canon-Deferred)
---------------------------------------------------------------------
CHANGE:
• Introduce Summary removal via explicit confirmation
• Removed Summaries are archived (named, not defined)
• Tasks are untouched and may become orphaned

INVARIANTS (PRESERVED):
• No task mutation on Summary removal
• No lifecycle semantics introduced
• No archive visibility or restore
• Summary movement semantics unchanged
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import SummaryRemoveModal from "./components/SummaryRemoveModal";
import { localAssignees } from "./data/localAssignees";

export default function App() {
  /* ===================== WORKSPACE ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual");
  const [focusedPane, setFocusedPane] = useState(null);

  /* ===================== DATA ===================== */

  const [summaries, setSummaries] = useState([]);
  const [archivedSummaries, setArchivedSummaries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  /* ===================== SUMMARY MOVE ===================== */

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [summaryToMoveId, setSummaryToMoveId] = useState(null);

  function openSummaryMoveModal(id) {
    setSummaryToMoveId(id);
    setMoveModalOpen(true);
  }

  function closeSummaryMoveModal() {
    setMoveModalOpen(false);
    setSummaryToMoveId(null);
  }

  function moveSummaryByOffset(offset) {
    setSummaries((current) => {
      const idx = current.findIndex((s) => s.id === summaryToMoveId);
      if (idx === -1) return current;

      const target = idx + offset;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  /* ===================== SUMMARY REMOVE ===================== */

  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [summaryToRemoveId, setSummaryToRemoveId] = useState(null);

  function openSummaryRemoveModal(id) {
    setSummaryToRemoveId(id);
    setRemoveModalOpen(true);
  }

  function closeSummaryRemoveModal() {
    setRemoveModalOpen(false);
    setSummaryToRemoveId(null);
  }

  function confirmRemoveSummary() {
    setSummaries((current) => {
      const target = current.find((s) => s.id === summaryToRemoveId);
      if (!target) return current;

      setArchivedSummaries((a) => [...a, target]);
      return current.filter((s) => s.id !== summaryToRemoveId);
    });

    if (selectedSummaryId === summaryToRemoveId) {
      setSelectedSummaryId(null);
    }

    closeSummaryRemoveModal();
  }

  /* ===================== SIDEBAR ===================== */

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  /* ===================== PANE FOCUS ===================== */

  function onFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
  }

  function onReturnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
  }

  /* ===================== CREATION ===================== */

  function onCreateTask() {
    const id = `task-${Date.now()}`;
    const task = {
      id,
      title: "New Task",
      notes: [],
      summaryId: null,
      executionState: "NOT_STARTED",
    };
    setTasks((c) => [...c, task]);
    setActiveTask(task);
  }

  function onCreateSummary() {
    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    setSummaries((c) => [
      ...c,
      { id: `summary-${Date.now()}`, title: title.trim() },
    ]);
  }

  /* ===================== TASK ↔ SUMMARY ===================== */

  function onChangeTaskSummary(taskId, summaryId) {
    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  /* ===================== TASK POPUP ===================== */

  function onOpenTask(task) {
    setActiveTask(task);
  }

  function onCloseTask() {
    setActiveTask(null);
  }

  function onAssignTask(taskId, assigneeId) {
    setTasks((c) =>
      c.map((t) => {
        if (t.id !== taskId || t.assigneeId) return t;
        const a = localAssignees.find((x) => x.id === assigneeId);
        return {
          ...t,
          assigneeId,
          assigneeLabel: a ? a.displayName : assigneeId,
          assignedAt: new Date().toISOString(),
        };
      })
    );
  }

  function onAddNote(taskId, note) {
    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, notes: [...(t.notes || []), note] } : t
      )
    );
  }

  function onStartExecution(taskId) {
    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "NOT_STARTED"
          ? {
              ...t,
              executionState: "IN_PROGRESS",
              startedAt: new Date().toISOString(),
              startedBy: "current-user",
            }
          : t
      )
    );
  }

  /* ===================== SHARED SURFACE ===================== */

  const allowCreation = workspaceMode === "single";

  const workSurface = (
    <PreProject
      summaries={summaries}
      tasks={tasks}
      selectedSummaryId={selectedSummaryId}
      onSelectSummary={setSelectedSummaryId}
      onOpenTask={onOpenTask}
      onOpenSummaryActions={openSummaryMoveModal}
      canCreateTask={allowCreation}
      onCreateTask={onCreateTask}
      canCreateSummary={allowCreation}
      onCreateSummary={onCreateSummary}
    />
  );

  const activeIndex = summaries.findIndex((s) => s.id === summaryToMoveId);
  const activeSummary = activeIndex !== -1 ? summaries[activeIndex] : null;

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <DualPane
          mode={workspaceMode}
          focusedPane={focusedPane}
          onFocusPane={onFocusPane}
          onReturnToDual={onReturnToDual}
          managementBody={workSurface}
          developmentBody={workSurface}
        />
      </div>

      <SummaryMoveModal
        open={moveModalOpen}
        summaryTitle={activeSummary ? activeSummary.title : ""}
        isFirst={activeIndex <= 0}
        isLast={activeIndex >= summaries.length - 1}
        onMoveUp={() => moveSummaryByOffset(-1)}
        onMoveDown={() => moveSummaryByOffset(1)}
        onClose={closeSummaryMoveModal}
        onRequestRemove={() => {
          closeSummaryMoveModal();
          openSummaryRemoveModal(summaryToMoveId);
        }}
      />

      <SummaryRemoveModal
        open={removeModalOpen}
        summaryTitle={
          summaries.find((s) => s.id === summaryToRemoveId)?.title || ""
        }
        onConfirm={confirmRemoveSummary}
        onCancel={closeSummaryRemoveModal}
      />

      {activeTask && (
        <TaskPopup
          task={activeTask}
          summaries={summaries}
          onClose={onCloseTask}
          onChangeTaskSummary={onChangeTaskSummary}
          onAssignTask={onAssignTask}
          onAddNote={onAddNote}
          onStartExecution={onStartExecution}
        />
      )}
    </>
  );
}
