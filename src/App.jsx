// @ts-nocheck
import { useState } from "react";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
Stage 148 — Gate G3: Task Assignment Authority
=====================================================================
- Owns task state
- Owns popup activation
- Assignment is explicit and irreversible
=====================================================================
*/

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [auditLog, setAuditLog] = useState([]);

  /* ================= POPUP CONTROL ================= */

  function onOpenTask(task) {
    setActiveTask(task);
  }

  function onCloseTask() {
    setActiveTask(null);
  }

  /* ================= G3 ASSIGNMENT ================= */

  function onAssignTask(taskId, assigneeId) {
    setTasks((current) => {
      const idx = current.findIndex((t) => t.id === taskId);
      if (idx === -1) return current;

      const task = current[idx];
      if (task.assigneeId) return current;

      const assignee = localAssignees.find(
        (a) => a.id === assigneeId
      );

      const updatedTask = {
        ...task,
        assigneeId,
        assigneeLabel: assignee
          ? assignee.displayName
          : assigneeId,
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

  /* ================= NOTES ================= */

  function onAddNote(taskId, note) {
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId
          ? { ...t, notes: [...(t.notes || []), note] }
          : t
      )
    );
  }

  /* ================= SUMMARY MOVE ================= */

  function onChangeTaskSummary(taskId, summaryId) {
    setTasks((current) =>
      current.map((t) =>
        t.id === taskId ? { ...t, summaryId } : t
      )
    );
  }

  /* ================= CREATE TASK ================= */

  function onCreateTask() {
    const id = `task-${Date.now()}`;
    setTasks((current) => [
      ...current,
      { id, title: "New Task", notes: [], summaryId: null },
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
              t.id === taskId && !t.assigneeId
                ? { ...t, title }
                : t
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
          onChangeTaskSummary={onChangeTaskSummary}
        />
      )}
    </>
  );
}
