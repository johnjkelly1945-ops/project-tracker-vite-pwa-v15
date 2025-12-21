/* ======================================================================
   METRA — DualPane.jsx
   Stage 11.2.x — TaskPopup Re-attachment (Restored)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Accept adapted repository payload
   ✔ Maintain mgmt/dev internal state
   ✔ Bridge legacy PreProject contract (summaries + tasks)
   ✔ Restore TaskPopup activation (Stage 5 wiring pattern)
   ✔ No governance, documents, or UI changes
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject";
import RepositoryOverlay from "./RepositoryOverlay";
import TaskPopup from "./TaskPopup";

import { adaptRepoPayloadToWorkspace } from "../utils/repo/repoPayloadAdapter";

export default function DualPane() {
  /* --------------------------------------------------------------
     WORKSPACE STATE (AUTHORITATIVE)
     -------------------------------------------------------------- */
  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  const [showRepo, setShowRepo] = useState(false);

  /* --------------------------------------------------------------
     POPUP STATE (RESTORED — STAGE 5 PATTERN)
     -------------------------------------------------------------- */
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  /* --------------------------------------------------------------
     REPOSITORY IMPORT HANDLER
     -------------------------------------------------------------- */
  function handleRepositoryExport(intentPayload) {
    console.log("📥 DualPane received payload", intentPayload);

    const adapted = adaptRepoPayloadToWorkspace(intentPayload);
    console.log("🧩 Adapted workspace payload", adapted);

    const targetPane = adapted.pane || "mgmt";

    if (targetPane === "dev") {
      setDevSummaries(prev => [...prev, ...adapted.summaries]);
      setDevTasks(prev => [...prev, ...adapted.tasks]);
    } else {
      setMgmtSummaries(prev => [...prev, ...adapted.summaries]);
      setMgmtTasks(prev => [...prev, ...adapted.tasks]);
    }

    setShowRepo(false);
  }

  /* --------------------------------------------------------------
     TASK ACTIVATION (POPUP)
     -------------------------------------------------------------- */
  function handleTaskClick(task, pane = "mgmt") {
    setSelectedTask(task);
    setSelectedPane(pane);
  }

  function handleTaskSave(updatedTask) {
    if (!updatedTask || !selectedPane) return;

    if (selectedPane === "dev") {
      setDevTasks(prev =>
        prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
      );
    } else {
      setMgmtTasks(prev =>
        prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
      );
    }

    setSelectedTask(updatedTask);
  }

  function closeTaskPopup() {
    setSelectedTask(null);
    setSelectedPane(null);
  }

  /* --------------------------------------------------------------
     LEGACY BRIDGE (Stage 11)
     -------------------------------------------------------------- */
  const summaries = mgmtSummaries;
  const tasks = mgmtTasks;

  /* --------------------------------------------------------------
     RENDER
     -------------------------------------------------------------- */
  return (
    <>
      <button
        style={{ margin: "8px" }}
        onClick={() => setShowRepo(true)}
      >
        Repository
      </button>

      <PreProject
        summaries={summaries}
        tasks={tasks}
        onTaskClick={task => handleTaskClick(task, "mgmt")}
      />

      {showRepo && (
        <RepositoryOverlay
          activePane="mgmt"
          onExport={handleRepositoryExport}
          onClose={() => setShowRepo(false)}
        />
      )}

      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
            onSave={handleTaskSave}
          />,
          document.getElementById("metra-popups")
        )}
    </>
  );
}
