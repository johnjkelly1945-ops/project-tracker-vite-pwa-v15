/* ======================================================================
   METRA – DualPane.jsx
   Stage 6.8 – Real Repo Trigger via Overlay (Replace-Only)
   ----------------------------------------------------------------------
   ✔ Repository overlay opens from Main
   ✔ Payload flows into importRepoPayload
   ✔ Replace-only semantics
   ✔ No persistence
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

  const openTaskPopup = (task, pane) => {
    console.log("🟢 Task clicked:", task);
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

    if (adapted.type === "mgmt") {
      setMgmtSummaries(adapted.summaries);
      setMgmtTasks(adapted.tasks);
    }

    if (adapted.type === "dev") {
      setDevSummaries(adapted.summaries);
      setDevTasks(adapted.tasks);
    }

    setShowRepo(false); // close overlay after import
  };

  /* ============================ RENDER =========================== */

  return (
    <div className="dual-pane-workspace">

      {/* ================= MANAGEMENT ================= */}
      <div className="pane mgmt-pane">
        <div className="pane-header">
          <button onClick={() => setShowRepo(true)} style={{ marginRight: "12px" }}>
            Open Repository
          </button>
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

      {/* ================= DEVELOPMENT ================= */}
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

      {/* ================= POPUPS ================= */}
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
            onClose={() => setShowRepo(false)}
            onAddToWorkspace={importRepoPayload}
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
