// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import Personnel from "./components/Personnel";

/*
=====================================================================
METRA — App.jsx
Stage 233 — Canonical Personnel Assignment Routing
---------------------------------------------------------------------
• Assignment routed exclusively via Personnel module
• Legacy assignment path removed
• Single-step authority transition (no intermediate state)
• SEM-NR-01 preserved
=====================================================================
*/

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState("dual"); // "dual" | "single"
  const [focusedPane, setFocusedPane] = useState(null);       // "management" | "development" | null
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Canonical authority gate
  const isReadOnly = workspaceMode === "dual" || !focusedPane;
  const isDev = focusedPane === "development";

  /* ===================== DATA ===================== */

  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [devSummaryOrder, setDevSummaryOrder] = useState([]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [mgmtSummaryOrder, setMgmtSummaryOrder] = useState([]);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  // Stage 233 — assignment routing state
  const [assigningTaskId, setAssigningTaskId] = useState(null);

  /* ===================== NAV ===================== */

  function handleFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setActiveTaskId(null);
    setActiveSummaryId(null);
    setAssigningTaskId(null);
  }

  function returnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
    setActiveTaskId(null);
    setActiveSummaryId(null);
    setAssigningTaskId(null);
  }

  /* ===================== HELPERS ===================== */

  function deriveOrderedSummaries(summaries, order) {
    return order.length > 0
      ? order.map((id) => summaries.find((s) => s.id === id)).filter(Boolean)
      : summaries;
  }

  const orderedDevSummaries = deriveOrderedSummaries(
    devSummaries,
    devSummaryOrder
  );

  const orderedMgmtSummaries = deriveOrderedSummaries(
    mgmtSummaries,
    mgmtSummaryOrder
  );

  /* ===================== CREATION ===================== */

  function onCreateTask() {
    if (isReadOnly) return;

    const title = window.prompt("Enter task title:");
    if (!title || !title.trim()) return;

    const task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      notes: [],
      summaryId: null,
      executionState: "NOT_STARTED",
      taskState: "active",
    };

    (isDev ? setDevTasks : setMgmtTasks)((c) => [...c, task]);
  }

  function onCreateSummary() {
    if (isReadOnly) return;

    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    const id = `summary-${Date.now()}`;

    if (isDev) {
      setDevSummaries((c) => [...c, { id, title: title.trim() }]);
      setDevSummaryOrder((c) => [...c, id]);
    } else {
      setMgmtSummaries((c) => [...c, { id, title: title.trim() }]);
      setMgmtSummaryOrder((c) => [...c, id]);
    }
  }

  /* ===================== SUMMARY AUTHORITY ===================== */

  function openSummaryIfAuthorised(summaryId) {
    if (isReadOnly) return;
    setActiveSummaryId(summaryId);
  }

  function moveSummary(summaryId, direction) {
    if (isReadOnly) return;

    const setOrder = isDev ? setDevSummaryOrder : setMgmtSummaryOrder;

    setOrder((prev) => {
      const index = prev.indexOf(summaryId);
      if (index === -1) return prev;

      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  function removeSummary(summaryId) {
    if (isReadOnly) return;

    const setSummaries = isDev ? setDevSummaries : setMgmtSummaries;
    const setOrder = isDev ? setDevSummaryOrder : setMgmtSummaryOrder;
    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setSummaries((c) => c.filter((s) => s.id !== summaryId));
    setOrder((c) => c.filter((id) => id !== summaryId));
    setTasks((c) =>
      c.map((t) =>
        t.summaryId === summaryId ? { ...t, summaryId: null } : t
      )
    );

    setActiveSummaryId(null);
  }

  /* ===================== TASK AUTHORITY ===================== */

  const tasks = isDev ? devTasks : mgmtTasks;
  const setTasks = isDev ? setDevTasks : setMgmtTasks;

  function onOpenTask(task) {
    if (isReadOnly) return;
    setActiveTaskId(task.id);
  }

  // Stage 233 — enter Personnel assignment flow
  function onRequestAssign(taskId) {
    if (isReadOnly) return;
    setAssigningTaskId(taskId);
    setActiveTaskId(null);
  }

  // Stage 233 — accept canonical assignment result
  function onAssignmentComplete(updatedTask) {
    setTasks((c) =>
      c.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setAssigningTaskId(null);
  }

  function onCancelAssignment() {
    setAssigningTaskId(null);
  }

  function onChangeTaskSummary(taskId, summaryId) {
    if (isReadOnly) return;

    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader
        workspaceMode={workspaceMode}
        onReturnToDual={returnToDual}
      />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((c) => !c)}
          onFocusPane={handleFocusPane}
        />

        {assigningTaskId ? (
          <Personnel
            task={tasks.find((t) => t.id === assigningTaskId)}
            onAssignComplete={onAssignmentComplete}
            onCancel={onCancelAssignment}
          />
        ) : workspaceMode === "dual" ? (
          <DualPane
            devSummaries={orderedDevSummaries}
            devTasks={devTasks}
            mgmtSummaries={orderedMgmtSummaries}
            mgmtTasks={mgmtTasks}
            onOpenTask={onOpenTask}
            onCreateTask={onCreateTask}
            onCreateSummary={onCreateSummary}
            onMoveSummary={moveSummary}
          />
        ) : (
          <PreProject
            summaries={isDev ? orderedDevSummaries : orderedMgmtSummaries}
            tasks={tasks}
            activeSummaryId={activeSummaryId}
            activeTaskId={activeTaskId}
            onOpenTask={onOpenTask}
            onCreateTask={onCreateTask}
            onCreateSummary={onCreateSummary}
            onMoveSummary={moveSummary}
            onOpenSummary={openSummaryIfAuthorised}
          />
        )}

        {activeTaskId && (
          <TaskPopup
            task={tasks.find((t) => t.id === activeTaskId)}
            onClose={() => setActiveTaskId(null)}
            onRequestAssign={onRequestAssign}
            onChangeTaskSummary={onChangeTaskSummary}
          />
        )}
      </div>

      <SummaryMoveModal />
    </>
  );
}
