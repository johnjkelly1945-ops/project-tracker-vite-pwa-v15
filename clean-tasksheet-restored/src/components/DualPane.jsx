/* ======================================================================
   METRA – DualPane.jsx
   Stage 6.9 – Repository Import (Explicit Summary Linking)
   ----------------------------------------------------------------------
   ✔ Tasks linked to summaries on import
   ✔ Summaries become visible in PreProject
   ✔ Replace-only semantics preserved
   ✔ No hierarchy inference beyond explicit selection
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";
import RepositoryOverlay from "./RepositoryOverlay.jsx";

import { adaptRepoPayloadToWorkspace } from
  "../utils/repo/repoPayloadAdapter.js";

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ======================= WORKSPACE STATE ======================= */

  const [mgmtTasks, setMgmtTasks] = useState([
    { id: "local-1", title: "Define Project Justification", status: "Not Started" },
    { id: "local-2", title: "Identify Options and Feasibility", status: "Not Started" },
  ]);
  const [mgmtSummaries, setMgmtSummaries] = useState([]);

  const [devTasks, setDevTasks] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  /* ========================= UI STATE ============================ */

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);
  const [showRepo, setShowRepo] = useState(false);
  const [repoPaneContext] = useState("mgmt");

  const openTaskPopup = (task, pane) => {
    setSelectedTask(task);
    setSelectedPane(pane);
  };

  const closeTaskPopup = () => {
    setSelectedTask(null);
    setSelectedPane(null);
  };

  /* ===================== MAIN IMPORT GATE ======================== */

  const importRepoPayload = (payload) => {
    const adapted = adaptRepoPayloadToWorkspace(payload);
    if (!adapted) return;

    const summaries = adapted.summaries || [];
    let tasks = adapted.tasks || [];

    // 🔑 EXPLICIT LINKING RULE (Stage 6.9 only)
    if (summaries.length > 0 && tasks.length > 0) {
      const targetSummaryId = summaries[0].id;
      tasks = tasks.map(task => ({
        ...task,
        summaryId: targetSummaryId
      }));
    }

    if (adapted.pane === "mgmt") {
      setMgmtSummaries(summaries);
      setMgmtTasks(tasks);
    }

    if (adapted.pane === "dev") {
      setDevSummaries(summaries);
      setDevTasks(tasks);
    }

    setShowRepo(false);
  };

  /* ============================ RENDER =========================== */

  return (
    <div className="dual-pane-workspace">

      <div className="workspace-header">
        <button onClick={() => setShowRepo(true)}>
          Open Repository
        </button>
      </div>

      <div className="pane mgmt-pane">
        <div className="pane-header">
          <h2>Management Tasks</h2>
        </div>

        <FilterBar mode="mgmt" />

        <div className="pane-content">
          <PreProject
            pane="mgmt"
            tasks={mgmtTasks}
            summaries={mgmtSummaries}
            openPopup={(task) => openTaskPopup(task, "mgmt")}
          />
        </div>
      </div>

      <div className="pane dev-pane">
        <div className="pane-header">
          <h2>Development Tasks</h2>
        </div>

        <FilterBar mode="dev" />

        <div className="pane-content">
          <PreProject
            pane="dev"
            tasks={devTasks}
            summaries={devSummaries}
            openPopup={(task) => openTaskPopup(task, "dev")}
          />
        </div>
      </div>

      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
          />,
          document.getElementById("metra-popups")
        )}

      {showRepo &&
        createPortal(
          <RepositoryOverlay
            activePane={repoPaneContext}
            onExport={importRepoPayload}
            onClose={() => setShowRepo(false)}
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
