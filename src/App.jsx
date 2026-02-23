// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import PersonnelPanel from "./components/PersonnelPanel";
import ProjectRegistersHost from "./components/registers/ProjectRegistersHost";
import RepositoryView from "./components/RepositoryView";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
=====================================================================

Stage 277 — Project Registers Host (Baseline)
Stage 278A — Project Registers Host Surface (Read-Only)
Stage 299 — Authority Derivation Correction
Stage 301 — Workspace Structural Restoration
Stage 302 — Task & Summary Mutation Restoration (baseline-257C)
Stage 302-A — Reassignment Canon Clarification

Design Authority:
• Stage 298 — Authority Derivation & Pane Semantics (Design-Locked)
• SEM-NR-01-A — Authority Derivation & Pane Semantics
=====================================================================
*/

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState("dual");
  const [focusedPane, setFocusedPane] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  /* ================================================================
     STAGE 345 — REPOSITORY STATE (ADDITIVE ONLY)
     ================================================================ */
  const [activeRepositoryDiscipline, setActiveRepositoryDiscipline] = useState(null);

  function openRepository(discipline) {
    setActiveRepositoryDiscipline(discipline);
  }

  function closeRepository() {
    setActiveRepositoryDiscipline(null);
  }

  // ------------------------------------------------------------------
  // AUTHORITY DERIVATION (LOCKED)
  // ------------------------------------------------------------------
  const hasMutationAuthority =
    workspaceMode === "single" && focusedPane !== null;

  const isReadOnly = !hasMutationAuthority;
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

  /* ===================== CREATION (INLINE — CANONICAL) ===================== */

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

  // ------------------------------------------------------------------
  // ASSIGN / REASSIGN — CANONICAL (OVERWRITE ALLOWED)
  // ------------------------------------------------------------------
  function onAssignTask(taskId, assigneeId) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId
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

  function onAddDescription(taskId, entry) {
    if (isReadOnly) return;

    const setTasks = isDev ? setDevTasks : setMgmtTasks;

    setTasks((c) =>
      c.map((t) =>
        t.id === taskId
          ? {
              ...t,
              descriptionEntries: [
                ...(t.descriptionEntries || []),
                entry,
              ],
            }
          : t
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
      canCreateTask={hasMutationAuthority}
      onCreateTask={onCreateTask}
      canCreateSummary={hasMutationAuthority}
      onCreateSummary={onCreateSummary}
      onOpenRepository={() =>
        openRepository(
          focusedPane === "development"
            ? "development"
            : "management"
        )
      }
    />
  );

  const devBody = (
    <PreProject
      summaries={orderedDevSummaries}
      tasks={devTasks.filter((t) => (t.taskState || "active") !== "archived")}
      onOpenTask={onOpenTask}
      onOpenSummary={openSummaryIfAuthorised}
      canCreateTask={hasMutationAuthority}
      onCreateTask={onCreateTask}
      canCreateSummary={hasMutationAuthority}
      onCreateSummary={onCreateSummary}
      onOpenRepository={() =>
        openRepository(
          focusedPane === "development"
            ? "development"
            : "management"
        )
      }
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

        {false && <PersonnelPanel />}

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
            onAddDescription={onAddDescription}
            onAssignTask={onAssignTask}
            onStartExecution={onStartExecution}
            onSubmitExecution={onSubmitExecution}
            onCompleteExecution={onCompleteExecution}
            onChangeTaskSummary={onChangeTaskSummary}
            onArchiveTask={onArchiveTask}
          />
        )}
      </div>
      {activeRepositoryDiscipline && (
        <RepositoryView
          discipline={activeRepositoryDiscipline}
          onClose={closeRepository}
        />
      )}
    </>
  );
}
