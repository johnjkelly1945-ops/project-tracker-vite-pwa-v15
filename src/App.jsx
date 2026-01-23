// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 195 — Task Title Semantics & Association Wiring (CANONICAL FIX)
---------------------------------------------------------------------
• Restore TaskPopup prop contract
• No authority change
• No lifecycle change
• No rendering change
• No stream logic change
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
   SINGLE-PANE HEADER
   ================================================================ */

function SinglePaneHeader({ title, onReturn }) {
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
        fontWeight: 600,
      }}
    >
      <span>{title}</span>
      <button
        onClick={onReturn}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        ↙
      </button>
    </div>
  );
}

/* ================================================================
   APP
   ================================================================ */

export default function App() {
  const [workspaceMode, setWorkspaceMode] = useState("dual");
  const [focusedPane, setFocusedPane] = useState(null);
  const isReadOnly = workspaceMode === "dual";

  /* ===================== DATA ===================== */

  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);

  const [activeTask, setActiveTask] = useState(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

  /* ===================== TASK CREATION ===================== */

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const isDev = focusedPane === "development";

  const summaries = isDev ? devSummaries : mgmtSummaries;
  const setSummaries = isDev ? setDevSummaries : setMgmtSummaries;

  const tasks = isDev ? devTasks : mgmtTasks;
  const setTasks = isDev ? setDevTasks : setMgmtTasks;

  /* ===================== NAV ===================== */

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

  /* ===================== CREATION ===================== */

  function onCreateTask() {
    if (isReadOnly) return;
    setNewTaskTitle("");
    setCreateTaskOpen(true);
  }

  function confirmCreateTask() {
    const title = newTaskTitle.trim();
    if (!title) return;

    const task = {
      id: `task-${Date.now()}`,
      title,
      notes: [],
      summaryId: null,
      executionState: "NOT_STARTED",
    };

    setTasks((c) => [...c, task]);
    setCreateTaskOpen(false);
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

  /* ===================== TASK ↔ SUMMARY ===================== */

  function onChangeTaskSummary(taskId, summaryId) {
    if (isReadOnly) return;

    setTasks((c) =>
      c.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );

    setSelectedSummaryId(summaryId);
  }

  /* ===================== TASK POPUP ===================== */

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
          ? { ...t, executionState: "IN_PROGRESS" }
          : t
      )
    );
  }

  /* ===================== SURFACES ===================== */

  const mgmtReadOnly = (
    <PreProject
      summaries={mgmtSummaries}
      tasks={mgmtTasks}
      selectedSummaryId={null}
      onSelectSummary={null}
      onOpenTask={null}
      canCreateTask={false}
      canCreateSummary={false}
      showFooter={false}
    />
  );

  const devReadOnly = (
    <PreProject
      summaries={devSummaries}
      tasks={devTasks}
      selectedSummaryId={null}
      onSelectSummary={null}
      onOpenTask={null}
      canCreateTask={false}
      canCreateSummary={false}
      showFooter={false}
    />
  );

  const singleSurface = (
    <PreProject
      summaries={summaries}
      tasks={tasks}
      selectedSummaryId={selectedSummaryId}
      onSelectSummary={setSelectedSummaryId}
      onOpenTask={onOpenTask}
      canCreateTask={!isReadOnly}
      onCreateTask={onCreateTask}
      canCreateSummary={!isReadOnly}
      onCreateSummary={onCreateSummary}
      showFooter={!isReadOnly}
    />
  );

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar />

        <div style={{ flex: 1 }}>
          {workspaceMode === "dual" ? (
            <DualPane
              mode="dual"
              onFocusPane={onFocusPane}
              onReturnToDual={onReturnToDual}
              managementBody={mgmtReadOnly}
              developmentBody={devReadOnly}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <SinglePaneHeader
                title={focusedPane === "management" ? "Management" : "Development"}
                onReturn={onReturnToDual}
              />
              {singleSurface}
            </div>
          )}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {createTaskOpen && !isReadOnly && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }}>
          <div style={{ background: "#fff", padding: 16, width: 360, margin: "20vh auto" }}>
            <h3>Create Task</h3>
            <input
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <button onClick={confirmCreateTask} disabled={!newTaskTitle.trim()}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* TASK POPUP — CONTRACT RESTORED */}
      {activeTask && !isReadOnly && (
        <TaskPopup
          task={activeTask}
          summaries={summaries}
          onClose={() => setActiveTask(null)}
          onAssignTask={onAssignTask}
          onAddNote={onAddNote}
          onStartExecution={onStartExecution}
          onChangeTaskSummary={onChangeTaskSummary}
        />
      )}

      <SummaryMoveModal />
      <SummaryRemoveModal />
    </>
  );
}
