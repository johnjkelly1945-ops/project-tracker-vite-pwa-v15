/*
=====================================================================
METRA — PreProject.jsx
Stage 19.2 — FINAL VERIFIED (Active Task Rebinding)
---------------------------------------------------------------------
• PM can open popup on unassigned tasks
• Assignment occurs inside popup
• Assignment immediately activates task
• activeTask is rebound after updates
• Notes unlock immediately after activation
• NO semantic changes
• NO permission expansion
=====================================================================
*/

import { useState } from "react";
import AddItemPopup from "./AddItemPopup";
import TaskPopup from "./TaskPopup";

export default function PreProject({
  initialTasks = [],
  initialSummaries = []
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [summaries, setSummaries] = useState(initialSummaries);
  const [popupMode, setPopupMode] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [pendingDeleteSummaryId, setPendingDeleteSummaryId] = useState(null);
  const [toast, setToast] = useState(null);

  /* -------------------------------------------------
     Identity (temporary — Stage 17 carry-forward)
     ------------------------------------------------- */
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  })();
  const currentUserId = currentUser?.id ?? null;

  /* -------------------------------------------------
     Helpers
     ------------------------------------------------- */
  const getPmAuthorityId = (task) =>
    task.pmId || task.creatorId || null;

  const isAssigned = (task) =>
    Boolean(
      (typeof task.assigned === "string" && task.assigned.trim()) ||
      (typeof task.person === "string" && task.person.trim())
    );

  /* -------------------------------------------------
     Popup access — Stage 19.2 rule
     ------------------------------------------------- */
  const canOpenTaskPopup = (task) => {
    if (!currentUserId || !task) return false;

    // PM can always open popup
    const pmAuthorityId = getPmAuthorityId(task);
    if (pmAuthorityId && pmAuthorityId === currentUserId) return true;

    // Assigned users after assignment
    if (!isAssigned(task)) return false;

    if (task.assignedId && task.assignedId === currentUserId) return true;
    if (task.assigned && task.assigned === currentUserId) return true;
    if (task.person && task.person === currentUserId) return true;

    return false;
  };

  /* -------------------------------------------------
     Task click
     ------------------------------------------------- */
  const handleTaskClick = (task) => {
    if (!canOpenTaskPopup(task)) return;
    setActiveTask(task);
  };

  /* -------------------------------------------------
     Render helpers
     ------------------------------------------------- */
  const tasksForSummary = (id) =>
    tasks.filter(task => task.summaryId === id);

  const orphanTasks = tasks.filter(task => task.summaryId == null);

  /* -------------------------------------------------
     Render
     ------------------------------------------------- */
  return (
    <div className="preproject-workspace">
      <button onClick={() => setPopupMode("add-summary")}>
        Add Summary
      </button>

      {toast && <div>{toast}</div>}

      {orphanTasks.map(task => (
        <div
          key={task.id}
          style={{ cursor: "pointer" }}
          onClick={() => handleTaskClick(task)}
        >
          {task.title}
        </div>
      ))}

      {summaries.map(summary => (
        <section key={summary.id}>
          <h3>{summary.title}</h3>
          {tasksForSummary(summary.id).map(task => (
            <div
              key={task.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleTaskClick(task)}
            >
              {task.title}
            </div>
          ))}
        </section>
      ))}

      {activeTask && (
        <TaskPopup
          task={activeTask}
          pane="preproject"
          onClose={() => setActiveTask(null)}
          onUpdate={(update) => {
            // 1. Update workspace task list
            setTasks(prev =>
              prev.map(t =>
                t.id === activeTask.id ? { ...t, ...update } : t
              )
            );

            // 2. IMMEDIATELY rebind active task
            setActiveTask(prev =>
              prev ? { ...prev, ...update } : prev
            );
          }}
        />
      )}
    </div>
  );
}
