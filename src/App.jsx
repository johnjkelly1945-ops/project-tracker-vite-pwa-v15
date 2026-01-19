// @ts-nocheck
import { useState } from "react";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
Stage 150 — Gate G5: Execution State (Read-Only, Popup-Only)
Stage 151A — Gate G6: Assignee Start Acknowledgement (Authority Added)
=====================================================================
- Owns task state
- Owns popup activation
- Assignment is explicit and irreversible
- Execution state was inspection-only (Stage 150)
- Stage 151A introduces ONE execution mutation:
    NOT_STARTED -> IN_PROGRESS (assignee-only)
=====================================================================
*/

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  function onOpenTask(task) {
    setActiveTask(task);
  }

  function onCloseTask() {
    setActiveTask(null);
  }

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

      setAuditLog((log) => [
        ...log,
        {
          eventType: "TASK_ASSIGNED_G3",
          taskId,
          assigneeId,
          assignedBy: "current-user",
          timestamp: new Date().toISOString(),
          priorState: { assigned: false },
        },
      ]);

      return next;
    });
  }

  // Stage 151A (Gate G6): Assignee Start Acknowledgement
  // - One-way: NOT_STARTED -> IN_PROGRESS
  // - Assignee-only (in current identity model: assigneeId must equal "current-user")
  // - Safe no-op on invalid attempts (no state change, no audit event)
  function onStartExecution(taskId) {
    setTasks((current) => {
      const idx = current.findIndex((t) => t.id === taskId);
      if (idx === -1) return current;

      const task = current[idx];

      // Must be assigned
      if (!task.assigneeId) return current;

      // Assignee-only (current simplified identity convention)
      if (task.assigneeId !== "current-user") return current;

      // Only allowed from NOT_STARTED
      const prior = task.executionState || "NOT_STARTED";
      if (prior !== "NOT_STARTED") return current;

      const updatedTask = {
        ...task,
        executionState: "IN_PROGRESS",
        startedAt: new Date().toISOString(),
        startedBy: "current-user",
      };

      const next = [...current];
      next[idx] = updatedTask;

      setAuditLog((log) => [
        ...log,
        {
          eventType: "TASK_EXECUTION_STARTED_G6",
          taskId,
          startedBy: "current-user",
          timestamp: new Date().toISOString(),
          priorState: "NOT_STARTED",
        },
      ]);

      return next;
    });
  }

  function onAddNote(taskId, note) {
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId ? { ...t, notes: [...(t.notes || []), note] } : t
      )
    );
  }

  function onChangeTaskSummary(taskId, summaryId) {
    setTasks((current) =>
      current.map((t) => (t.id === taskId ? { ...t, summaryId } : t))
    );
  }

  function onCreateTask() {
    const id = `task-${Date.now()}`;
    setTasks((current) => [
      ...current,
      {
        id,
        title: "New Task",
        notes: [],
        summaryId: null,
        executionState: "NOT_STARTED", // Stage 150 default
      },
    ]);
  }

  return (
    <>
      <PreProject
        summaries={summaries}
        tasks={tasks}
        onOpenTask={onOpenTask}
        onCreateTask={onCreateTask}
        canCreateTask={true}
        canEditIdentity={true}
        onUpdateTitle={(taskId, title) =>
          setTasks((current) =>
            current.map((t) =>
              t.id === taskId && !t.assigneeId ? { ...t, title } : t
            )
          )
        }
      />

      {activeTask && (
        <TaskPopup
          task={tasks.find((t) => t.id === activeTask.id)}
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
