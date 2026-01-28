// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
Stage 230 — Inline Task Status Indicators (Canonical Dot Projection)
[FIX — Sidebar onToggle wiring restored]
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

  /* ===================== NAV ===================== */

  function handleFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setActiveTaskId(null);
    setActiveSummaryId(null);
  }

  function returnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
    setActiveTaskId(null);
    setActiveSummaryId(null);
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

    if (isDev) {
      setDevSummaries((c) => c.filter((s) => s.id !== summaryId));
      setDevSummaryOrder((c) => c.filter((id) => id !== summaryId));
      setDevTasks((c) =>
        c.map((t) =>
          t.summaryId === summaryId ? { ...t, summaryId: null } : t
        )
      );
    } else {
      setMgmtSummaries((c) => c.filter((s) => s.id !== summaryId));
      setMgmtSummaryOrder((c) => c.filter((id) => id !== summaryId));
      setMgmtTasks((c) =>
        c.map((t) =>
          t.summaryId === summaryId ? { ...t, summaryId: null } : t
        )
      );
    }

    setActiveSummaryId(null);
  }

  /* ===================== TASK AUTHORITY ===================== */

  const tasks = isDev ? devTasks : mgmtTasks;

  function onOpenTask(task) {
    if (isReadOnly) return;
    setActiveTaskId(task.id);
  }

  function onAssignTask(taskId, assigneeId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && !t.assigneeId
          ? {
              ...t,
              assigneeId,
              assigneeLabel:
                localAssignees.find((a) => a.id === assigneeId)?.displayName ??
                assigneeId,
            }
          : t
      )
    );
  }

  function onChangeTaskSummary(taskId, summaryId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  function onAddNote(taskId, note) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, notes: [...(t.notes || []), note] } : t
      )
    );
  }

  function onStartExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "NOT_STARTED"
          ? { ...t, executionState: "IN_PROGRESS" }
          : t
      )
    );
  }

  function onSubmitExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "IN_PROGRESS"
          ? { ...t, executionState: "SUBMITTED" }
          : t
      )
    );
  }

  function onCompleteExecution(taskId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId && t.executionState === "SUBMITTED"
          ? { ...t, executionState: "COMPLETED" }
          : t
      )
    );
  }

  function onArchiveTask(taskId) {
    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId ? { ...t, taskState: "archived" } : t
      )
    );

    setActiveTaskId(null);
  }

  const activeTask =
    activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null;

  /* ===================== SURFACES ===================== */

  const mgmtBody = (
    <PreProject
      summaries={orderedMgmtSummaries}
      tasks={mgmtTasks.filter((t) => (t.taskState || "active") !== "archived")}
      onOpenTask={onOpenTask}
      onOpenSummary={openSummaryIfAuthorised}
      canCreateTask={!isReadOnly}
      onCreateTask={onCreateTask}
      canCreateSummary={!isReadOnly}
      onCreateSummary={onCreateSummary}
    />
  );

  const devBody = (
    <PreProject
      summaries={orderedDevSummaries}
      tasks={devTasks.filter((t) => (t.taskState || "active") !== "archived")}
      onOpenTask={onOpenTask}
      onOpenSummary={openSummaryIfAuthorised}
      canCreateTask={!isReadOnly}
      onCreateTask={onCreateTask}
      canCreateSummary={!isReadOnly}
      onCreateSummary={onCreateSummary}
    />
  );

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
          onFocusPane={handleFocusPane}
          onReturnToDual={returnToDual}
          managementBody={mgmtBody}
          developmentBody={devBody}
        />

        {activeSummaryId && (
          <SummaryMoveModal
            summaryId={activeSummaryId}
            summaries={isDev ? orderedDevSummaries : orderedMgmtSummaries}
            onMove={moveSummary}
            onRemove={removeSummary}
            onClose={() => setActiveSummaryId(null)}
          />
        )}

        {activeTask && (
          <TaskPopup
            task={activeTask}
            summaries={isDev ? orderedDevSummaries : orderedMgmtSummaries}
            onClose={() => setActiveTaskId(null)}
            onAddNote={onAddNote}
            onAssignTask={onAssignTask}
            onChangeTaskSummary={onChangeTaskSummary}
            onStartExecution={onStartExecution}
            onSubmitExecution={onSubmitExecution}
            onCompleteExecution={onCompleteExecution}
            onArchiveTask={onArchiveTask}
          />
        )}
      </div>
    </>
  );
}
