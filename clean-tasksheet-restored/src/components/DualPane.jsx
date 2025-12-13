/* ======================================================================
   METRA – DualPane.jsx
   Stage 6.2 – Repo Payload → Workspace Append (SAFE)
   ----------------------------------------------------------------------
   ✔ Uses repoPayloadAdapter
   ✔ Appends (never replaces) workspace data
   ✔ Sandbox-only wiring
   ✔ Fully reversible
   ====================================================================== */

import React, { useState } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";

import { adaptRepoPayloadToWorkspace } from "../sandbox/repo-integration/repoPayloadAdapter.js";

import "../Styles/DualPane.css";

export default function DualPane() {

  /* ================================================================
     WORKSPACE STATE (NOW MUTABLE)
     ================================================================ */
  const [mgmtTasks, setMgmtTasks] = useState([
    { id: 1, title: "Define Project Justification", status: "Not Started" },
    { id: 2, title: "Identify Options and Feasibility", status: "Not Started" },
  ]);

  const [mgmtSummaries, setMgmtSummaries] = useState([
    { id: "tmp-1", title: "Temporary Summary – Stage 5.5 Proof" }
  ]);

  const [devTasks, setDevTasks] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  /* ================================================================
     TASK INTERACTION
     ================================================================ */
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
     STAGE 6.2 — SIMULATED REPO IMPORT (SAFE)
     ================================================================ */
  const simulateRepoImport = () => {
    const fakeRepoPayload = {
      type: "mgmt",
      summaries: [
        { id: "repo-s1", title: "Imported Repo Summary" }
      ],
      tasks: [
        {
          id: "repo-t1",
          title: "Repo Task A",
          summaryId: "repo-s1"
        },
        {
          id: "repo-t2",
          title: "Repo Task B",
          summaryId: "repo-s1"
        }
      ]
    };

    const adapted = adaptRepoPayloadToWorkspace(fakeRepoPayload);

    if (adapted.type === "mgmt") {
      setMgmtSummaries(prev => [...prev, ...adapted.summaries]);
      setMgmtTasks(prev => [...prev, ...adapted.tasks]);
    }

    if (adapted.type === "dev") {
      setDevSummaries(prev => [...prev, ...adapted.summaries]);
      setDevTasks(prev => [...prev, ...adapted.tasks]);
    }
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="dual-pane-workspace">

      {/* === TEMP TEST CONTROL (Stage 6.2 only) === */}
      <div style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
        <button onClick={simulateRepoImport}>
          ➕ Simulate Repo Import
        </button>
      </div>

      {/* ================= MANAGEMENT ================= */}
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
