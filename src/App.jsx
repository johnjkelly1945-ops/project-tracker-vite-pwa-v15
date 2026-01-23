// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 194 — Dual Pane Read-Only Enforcement (Implementation)
---------------------------------------------------------------------
GOAL:
• Dual pane is strictly read-only
• Dual pane mirrors contents & structure of the corresponding single pane
• Dual pane renders BOTH scopes simultaneously (Management / Development)
• No authority leakage in dual pane (no create, no modal, no popup)

PRESERVED:
• Stage 139 pane headers & arrows
• Stage 192 pane-scoped working sets
• Existing single-pane operational behaviour (including association)
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

/* ================================================================
   PANE HEADER (RESTORED FROM STAGE 139)
   ================================================================ */

function PaneHeader({ title, arrow, onArrow }) {
  return (
    <div
      style={{
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #e0e0e0",
        background: "#fafafa",
        color: "#333",
        fontSize: "16px",
        fontWeight: 600,
        userSelect: "none",
      }}
    >
      <span>{title}</span>

      {arrow && (
        <button
          aria-label="Workspace mode transition"
          onClick={onArrow}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            color: "#555",
          }}
        >
          {arrow}
        </button>
      )}
    </div>
  );
}

/* ================================================================
   APP
   ================================================================ */

export default function App() {
  /* ===================== WORKSPACE ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual"); // 'dual' | 'single'
  const [focusedPane, setFocusedPane] = useState(null); // 'management' | 'development'
  const isReadOnly = workspaceMode === "dual";

  /* ===================== DATA (SCOPED) ===================== */

  const [devSummaries, setDevSummaries] = useState([]);
  const [devArchivedSummaries, setDevArchivedSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtArchivedSummaries, setMgmtArchivedSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);

  const [activeTask, setActiveTask] = useState(null);

  // Single-pane selection only (dual pane is read-only; selection not required)
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  /* ===================== HELPERS ===================== */

  const isDev = focusedPane === "development";

  const summaries = isDev ? devSummaries : mgmtSummaries;
  const setSummaries = isDev ? setDevSummaries : setMgmtSummaries;

  const archivedSummaries = isDev
    ? devArchivedSummaries
    : mgmtArchivedSummaries;
  const setArchivedSummaries = isDev
    ? setDevArchivedSummaries
    : setMgmtArchivedSummaries;

  const tasks = isDev ? devTasks : mgmtTasks;
  const setTasks = isDev ? setDevTasks : setMgmtTasks;

  /* ===================== SUMMARY MOVE (SINGLE PANE ONLY) ===================== */

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [summaryToMoveId, setSummaryToMoveId] = useState(null);

  function openSummaryMoveModal(id) {
    if (isReadOnly) return;
    setSummaryToMoveId(id);
    setMoveModalOpen(true);
  }

  function closeSummaryMoveModal() {
    setMoveModalOpen(false);
    setSummaryToMoveId(null);
  }

  function moveSummaryByOffset(offset) {
    if (isReadOnly) return;
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

  /* ===================== SUMMARY REMOVE (SINGLE PANE ONLY) ===================== */

  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [summaryToRemoveId, setSummaryToRemoveId] = useState(null);

  function openSummaryRemoveModal(id) {
    if (isReadOnly) return;
    setSummaryToRemoveId(id);
    setRemoveModalOpen(true);
  }

  function closeSummaryRemoveModal() {
    setRemoveModalOpen(false);
    setSummaryToRemoveId(null);
  }

  function confirmRemoveSummary() {
    if (isReadOnly) return;

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

  /* ===================== PANE NAV ===================== */

  function onFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setSelectedSummaryId(null);
    setActiveTask(null);
  }

  function onReturnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
    setSelectedSummaryId(null);
    setActiveTask(null);
  }

  /* ===================== CREATION (SINGLE PANE ONLY) ===================== */

  function onCreateTask() {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    setSummaries((c) => [
      ...c,
      { id: `summary-${Date.now()}`, title: title.trim() },
    ]);
  }

  /* ===================== TASK ↔ SUMMARY (SINGLE PANE ONLY) ===================== */

  function onChangeTaskSummary(taskId, summaryId) {
    if (isReadOnly) return;
    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  /* ===================== TASK POPUP (SINGLE PANE ONLY) ===================== */

  function onOpenTask(task) {
    if (isReadOnly) return;
    setActiveTask(task);
  }

  function onAssignTask(taskId, assigneeId) {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, notes: [...(t.notes || []), note] } : t
      )
    );
  }

  function onStartExecution(taskId) {
    if (isReadOnly) return;
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

  /* ===================== SURFACES ===================== */

  // Dual pane: render BOTH scopes, read-only, no footer, no authority callbacks
  const mgmtSurface = (
    <PreProject
      summaries={mgmtSummaries}
      tasks={mgmtTasks}
      selectedSummaryId={null}
      onSelectSummary={null}
      onOpenTask={null}
      onOpenSummaryActions={null}
      canCreateTask={false}
      onCreateTask={() => {}}
      canCreateSummary={false}
      onCreateSummary={() => {}}
      showFooter={false}
    />
  );

  const devSurface = (
    <PreProject
      summaries={devSummaries}
      tasks={devTasks}
      selectedSummaryId={null}
      onSelectSummary={null}
      onOpenTask={null}
      onOpenSummaryActions={null}
      canCreateTask={false}
      onCreateTask={() => {}}
      canCreateSummary={false}
      onCreateSummary={() => {}}
      showFooter={false}
    />
  );

  // Single pane: operational surface (existing behaviour preserved)
  const singleSurface = (
    <PreProject
      summaries={summaries}
      tasks={tasks}
      selectedSummaryId={selectedSummaryId}
      onSelectSummary={setSelectedSummaryId}
      onOpenTask={onOpenTask}
      onOpenSummaryActions={openSummaryMoveModal}
      canCreateTask={!isReadOnly}
      onCreateTask={onCreateTask}
      canCreateSummary={!isReadOnly}
      onCreateSummary={onCreateSummary}
      showFooter={!isReadOnly}
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

        <div style={{ flex: 1, minHeight: 0 }}>
          {workspaceMode === "dual" ? (
            <DualPane
              leftHeader={
                <PaneHeader
                  title="Management"
                  arrow="↗"
                  onArrow={() => onFocusPane("management")}
                />
              }
              leftBody={mgmtSurface}
              rightHeader={
                <PaneHeader
                  title="Development"
                  arrow="↗"
                  onArrow={() => onFocusPane("development")}
                />
              }
              rightBody={devSurface}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
              }}
            >
              <PaneHeader
                title={focusedPane === "management" ? "Management" : "Development"}
                arrow="↙"
                onArrow={onReturnToDual}
              />

              <div style={{ flex: 1, minHeight: 0 }}>{singleSurface}</div>
            </div>
          )}
        </div>
      </div>

      {/* Modals and popup are SINGLE PANE ONLY */}
      {!isReadOnly && (
        <>
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
              onClose={() => setActiveTask(null)}
              onChangeTaskSummary={onChangeTaskSummary}
              onAssignTask={onAssignTask}
              onAddNote={onAddNote}
              onStartExecution={onStartExecution}
            />
          )}
        </>
      )}
    </>
  );
}
