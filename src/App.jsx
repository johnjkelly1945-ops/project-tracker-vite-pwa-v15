// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 187 — Summary Naming at Creation (Workspace-Only, Immutable)
---------------------------------------------------------------------
CHANGE (STAGE 187):
• Require a name at workspace Summary creation time
• Name is supplied pre-creation and is immutable
• No rename or edit semantics introduced

INVARIANTS (PRESERVED):
• Footer remains sole creation authority
• Summaries remain mute after creation
• No movement, activation, lifecycle, or persistence semantics
• Repository / template Summaries are unaffected
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

  /* ===================== STAGE 185 — SUMMARY SELECTION ===================== */

  const [selectedSummaryId, setSelectedSummaryId] = useState(null);

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

  /* ===================== TASK CREATION ===================== */

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

  /* ===================== SUMMARY CREATION (AUTHORITATIVE) ===================== */

  function onCreateSummary() {
    // Stage 187 — require name at creation time (workspace-only)
    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) {
      return; // creation aborted if no name supplied
    }

    const id = `summary-${Date.now()}`;
    const newSummary = {
      id,
      title: title.trim(), // immutable after creation
    };

    setSummaries((current) => [...current, newSummary]);
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
            managementBody={
              workspaceMode === "single" && focusedPane === "management" ? (
                <PreProject
                  tasks={tasks}
                  summaries={summaries}
                  selectedSummaryId={selectedSummaryId}
                  onSelectSummary={setSelectedSummaryId}
                  onOpenTask={onOpenTask}
                  canCreateTask={true}
                  onCreateTask={onCreateTask}
                  canCreateSummary={true}
                  onCreateSummary={onCreateSummary}
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
                  tasks={tasks}
                  summaries={summaries}
                  selectedSummaryId={selectedSummaryId}
                  onSelectSummary={setSelectedSummaryId}
                  onOpenTask={onOpenTask}
                  canCreateTask={true}
                  onCreateTask={onCreateTask}
                  canCreateSummary={true}
                  onCreateSummary={onCreateSummary}
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
