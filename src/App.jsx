// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import PersonnelPanel from "./components/PersonnelPanel";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
=====================================================================

Stage 230 — Inline Task Status Indicators (Canonical Dot Projection)
Stage 255-A — Personnel Module Container Mounted (Inert)
Stage 264 — Reassignment Made Authoritative (Single-Axis)
Stage 271 — Sidebar Derived Register Wiring (READ-ONLY)

Stage 275 — Phase C
---------------------------------------------------------------------
• Adds isolated, read-only Artefact Register view
• Adds inert top-level view state (default: workspace)
• Workspace behaviour unchanged
=====================================================================
*/

export default function App() {
  /* ===================== TOP-LEVEL VIEW ===================== */

  const [activeView, setActiveView] = useState("workspace"); // inert by default

  /* ===================== WORKSPACE STATE ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual"); // "dual" | "single"
  const [focusedPane, setFocusedPane] = useState(null);       // "management" | "development" | null
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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

  /* ===================== STAGE 271 — DERIVATION (READ-ONLY) ===================== */

  function deriveArtefactsFromTasks(allTasks) {
    if (!Array.isArray(allTasks)) return [];

    const artefacts = [];

    allTasks.forEach((task) => {
      const notes = Array.isArray(task.notes) ? task.notes : [];

      notes.forEach((line) => {
        if (typeof line !== "string") return;

        const isDoc = line.startsWith("[System] Document linked:");
        const isTpl = line.startsWith("[System] Template linked:");

        if (!isDoc && !isTpl) return;

        const parts = line.split(" — ");
        if (parts.length < 2) return;

        const timestamp = parts[parts.length - 1];

        const body = parts[0]
          .replace("[System] Document linked:", "")
          .replace("[System] Template linked:", "")
          .trim();

        const [titleLine, refLine] = body.split("\n");

        if (!titleLine || !refLine) return;

        artefacts.push({
          type: isDoc ? "Document" : "Template",
          title: titleLine.replace(/^"|"$/g, ""),
          ref: refLine.trim(),
          timestamp,
          taskId: task.id,
          taskTitle: task.title,
        });
      });
    });

    return artefacts.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  }

  const allTasks = [...devTasks, ...mgmtTasks];
  const derivedArtefacts = deriveArtefactsFromTasks(allTasks);

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

  /* ===================== RENDER ===================== */

  if (activeView === "artefact-register") {
    return (
      <>
        <ModuleHeader />
        <div style={{ padding: "16px" }}>
          <h2>Artefact Register (Read-Only)</h2>
          {derivedArtefacts.length === 0 && (
            <div>No artefacts recorded.</div>
          )}
          {derivedArtefacts.map((a, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong>{a.type}</strong> — {a.title}
              <br />
              Task: {a.taskId} · {a.timestamp}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
          derivedArtefacts={derivedArtefacts}
        />

        <DualPane
          mode={workspaceMode}
          focusedPane={focusedPane}
          onFocusPane={handleFocusPane}
          onReturnToDual={returnToDual}
          managementBody={
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
          }
          developmentBody={
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
          }
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
