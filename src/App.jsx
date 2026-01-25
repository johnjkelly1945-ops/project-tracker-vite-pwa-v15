// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import SummaryRemoveModal from "./components/SummaryRemoveModal";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
Stage 207 — Corrective Restoration
---------------------------------------------------------------------
• Restore canonical single-pane surface rendering
• Single pane mounts PreProject (with footer)
• Dual pane remains footer-less
• Behaviour matches baseline-2026-01-25-stage206
=====================================================================
*/

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

  function handleFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setSelectedSummaryId(null);
    setActiveTask(null);
  }

  function returnToDual() {
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

  function cancelCreateTask() {
    const confirmAbort = window.confirm("Discard task creation?");
    if (!confirmAbort) return;
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
              focusedPane={focusedPane}
              onFocusPane={handleFocusPane}
              onReturnToDual={returnToDual}
              managementBody={mgmtReadOnly}
              developmentBody={devReadOnly}
            />
          ) : (
            singleSurface
          )}
        </div>
      </div>

      {createTaskOpen && !isReadOnly && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 16, width: 360, margin: "20vh auto", borderRadius: 6 }}>
            <h3>Create Task</h3>

            <input
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={cancelCreateTask}>Cancel</button>
              <button onClick={confirmCreateTask} disabled={!newTaskTitle.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTask && !isReadOnly && (
        <TaskPopup
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onAssignTask={onAssignTask}
          onAddNote={onAddNote}
          onStartExecution={onStartExecution}
        />
      )}

      <SummaryMoveModal />
      <SummaryRemoveModal />
    </>
  );
}
