// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 178 — Workspace Summary Presence (Read-Only)
---------------------------------------------------------------------
• Derives a read-only summary presence label from existing state
• Passes label to shell (DualPane) for presentation only
• No new authority, no new state, no behavioural changes
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import { localAssignees } from "./data/localAssignees";

export default function App() {
  /* ===================== WORKSPACE AUTHORITY ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual"); // "dual" | "single"
  const [focusedPane, setFocusedPane] = useState(null);       // "management" | "development" | null

  /* ===================== DATA ===================== */

  const [summaries, setSummaries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  /* ===================== SIDEBAR UI ===================== */

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

  /* ===================== READ-ONLY SUMMARY PRESENCE ===================== */

  const summaryPresenceLabel =
    summaries.length === 0 ? "No summaries" : `${summaries.length} summaries`;

  /* ===================== G1 TASK CREATION ===================== */

  function onCreateTask() {
    const id = `task-${Date.now()}`;
    const newTask = {
      id,
      title: "New Task",
      notes: [],
      summaryId: null,
      executionState: "NOT_STARTED",
    };

    setTasks((current) => [...current, newTask]);
    setActiveTask(newTask);
  }

  /* ===================== SUMMARY CREATION (RE-EXPOSURE) ===================== */

  function onCreateSummary() {
    // Existing summary creation flow to be reattached here.
    // Stage 178 intentionally introduces no new semantics.
    console.log("Create Summary");
  }

  /* ===================== POPUP CONTROL ===================== */

  function onOpenTask(task) {
    setActiveTask(task);
  }

  function onCloseTask() {
    setActiveTask(null);
  }

  /* ===================== G3 ASSIGNMENT ===================== */

  function onAssignTask(taskId, assigneeId) {
    setTasks((current) => {
      const idx = current.findIndex((t) => t.id === taskId);
      if (idx === -1) return current;

      const task = current[idx];
      if (task.assigneeId) return current;

      const assignee = localAssignees.find((a) => a.id === assigneeId);

      const updatedTask = {
        ...task,
        assigneeId,
        assigneeLabel: assignee ? assignee.displayName : assigneeId,
        assignedAt: new Date().toISOString(),
      };

      const next = [...current];
      next[idx] = updatedTask;
      return next;
    });
  }

  /* ===================== NOTES ===================== */

  function onAddNote(taskId, note) {
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId
          ? { ...t, notes: [...(t.notes || []), note] }
          : t
      )
    );
  }

  /* ===================== G6 EXECUTION START ===================== */

  function onStartExecution(taskId) {
    setTasks((current) => {
      const idx = current.findIndex((t) => t.id === taskId);
      if (idx === -1) return current;

      const task = current[idx];
      if (task.executionState !== "NOT_STARTED") return current;

      const updatedTask = {
        ...task,
        executionState: "IN_PROGRESS",
        startedAt: new Date().toISOString(),
        startedBy: "current-user",
      };

      const next = [...current];
      next[idx] = updatedTask;
      return next;
    });
  }

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <DualPane
            mode={workspaceMode}
            focusedPane={focusedPane}
            onFocusPane={onFocusPane}
            onReturnToDual={onReturnToDual}
            summaryPresenceLabel={summaryPresenceLabel}
            managementBody={
              workspaceMode === "single" && focusedPane === "management" ? (
                <PreProject
                  focus="management"
                  summaries={summaries}
                  tasks={tasks}
                  onOpenTask={onOpenTask}
                  canCreateTask={true}
                  onCreateTask={onCreateTask}
                  canCreateSummary={true}
                  onCreateSummary={onCreateSummary}
                  onReturnToDual={onReturnToDual}
                />
              ) : (
                <>
                  <p>No tasks in workspace.</p>
                  <p>Management inspection view.</p>
                </>
              )
            }
            developmentBody={
              workspaceMode === "single" && focusedPane === "development" ? (
                <PreProject
                  focus="development"
                  summaries={summaries}
                  tasks={tasks}
                  onOpenTask={onOpenTask}
                  canCreateTask={true}
                  onCreateTask={onCreateTask}
                  canCreateSummary={true}
                  onCreateSummary={onCreateSummary}
                  onReturnToDual={onReturnToDual}
                />
              ) : (
                <>
                  <p>No tasks in workspace.</p>
                  <p>Development inspection view.</p>
                </>
              )
            }
          />
        </div>
      </div>

      {activeTask && (
        <TaskPopup
          task={activeTask}
          onClose={onCloseTask}
          onAssignTask={onAssignTask}
          onAddNote={onAddNote}
          onStartExecution={onStartExecution}
        />
      )}
    </>
  );
}
