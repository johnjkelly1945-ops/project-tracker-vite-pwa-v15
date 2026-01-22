// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
Stage 188 — Task ↔ Summary Association (Execution Only)
---------------------------------------------------------------------
CHANGE (STAGE 188):
• Execute explicit Task → Summary association
• Association is task-owned and popup-driven
• Stored as task.summaryId
• No grouping, filtering, movement, or hierarchy introduced

INVARIANTS (PRESERVED):
• Footer remains sole creation authority
• Summaries remain mute
• Summary selection (Stage 185) unchanged
• Summary naming (Stage 187) unchanged
• No lifecycle, activation, or persistence semantics added
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

  /* ===================== SUMMARY CREATION (STAGE 187) ===================== */

  function onCreateSummary() {
    const title = window.prompt("Enter summary name:");
    if (!title || !title.trim()) return;

    const id = `summary-${Date.now()}`;
    const newSummary = {
      id,
      title: title.trim(), // immutable after creation
    };

    setSummaries((current) => [...current, newSummary]);
  }

  /* ===================== TASK ↔ SUMMARY ASSOCIATION (STAGE 188) ===================== */

  function onChangeTaskSummary(taskId, summaryId) {
    setTasks((current) => {
      const idx = current.findIndex((t) => t.id === taskId);
      if (idx === -1) return current;

      const task = current[idx];

      const updatedTask = {
        ...task,
        summaryId,
      };

      const next = [...current];
      next[idx] = updatedTask;
      return next;
    });
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
              ) : null
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
              ) : null
            }
          />
        </div>
      </div>

      {activeTask && (
        <TaskPopup
          task={activeTask}
          summaries={summaries}
          onClose={onCloseTask}
          onAddNote={onAddNote}
          onAssignTask={onAssignTask}
          onStartExecution={onStartExecution}
          onChangeTaskSummary={onChangeTaskSummary}
        />
      )}
    </>
  );
}
