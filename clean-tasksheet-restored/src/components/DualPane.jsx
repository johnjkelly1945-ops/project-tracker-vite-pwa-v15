/* ======================================================================
   METRA – DualPane.jsx
   Stage 6.6 – Main Wiring (Replace-Only, No Persistence)
   ----------------------------------------------------------------------
   PURPOSE:
   ✔ Official Main entry point for repo-shaped data
   ✔ Replace semantics only (no merge)
   ✔ Shared adapter (src/utils/repo)
   ✔ No persistence
   ✔ No UI expansion
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";

import { adaptRepoPayloadToWorkspace } from
  "../utils/repo/repoPayloadAdapter.js";

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ================================================================
     BASE WORKSPACE STATE
     ================================================================ */

  const [mgmtTasks, setMgmtTasks] = useState([
    { id: "local-1", title: "Define Project Justification", status: "Not Started" },
    { id: "local-2", title: "Identify Options and Feasibility", status: "Not Started" },
  ]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);

  const [devTasks, setDevTasks] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  /* ================================================================
     POPUP STATE
     ================================================================ */
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  const openTaskPopup = (task, pane) => {
    console.log("🟢 Task clicked:", task);
    setSelectedTask(task);
    setSelectedPane(pane);
  };

  const closeTaskPopup = () => {
    setSelectedTask(null);
    setSelectedPane(null);
  };

  /* ================================================================
     STAGE 6.6 – MAIN REPO IMPORT GATE (REPLACE)
     ================================================================ */
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
  };

  /* ================================================================
     TEMPORARY HARNESS (WILL BE REPLACED LATER)
     ================================================================ */
  const simulateRepoImport = () => {
    importRepoPayload({
      type: "mgmt",
      summaries: [
        { id: "repo-s1", title: "Imported Repo Summary" }
      ],
      tasks: [
        { id: "repo-t1", title: "Repo Task A", summaryId: "repo-s1" },
        { id: "repo-t2", title: "Repo Task B", summaryId: "repo-s1" },
      ],
    });
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="dual-pane-workspace">

      {/* ================= MANAGEMENT ================= */}
      <div className="pane mgmt-pane">

        <div className="pane-header">
          <button
            onClick={simulateRepoImport}
            style={{ marginRight: "12px" }}
          >
            + Simulate Repo Import
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

      {/* ================= POPUP ================= */}
      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
