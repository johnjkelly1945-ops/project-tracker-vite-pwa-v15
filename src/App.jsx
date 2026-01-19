// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
STAGE 159 — Section D
Workspace Mode & Pane Focus Authority
---------------------------------------------------------------------
• App owns workspace mode (dual | single)
• App owns focused pane (management | development)
• DualPane remains layout-only
• Arrows request focus via onFocusPane
• Sidebar retained in both modes
• No task or execution semantics changed
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";

export default function App() {
  /* ===================== WORKSPACE AUTHORITY ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual"); // dual | single
  const [focusedPane, setFocusedPane] = useState(null); // management | development

  /* ===================== DATA (UNCHANGED) ===================== */

  const [summaries, setSummaries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  /* ===================== SIDEBAR UI ===================== */

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  /* ===================== PANE FOCUS HANDLER ===================== */
  /* Called by DualPane arrows */

  function onFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
  }

  function onReturnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
  }

  /* ===================== TASK HANDLERS (AS-IS) ===================== */

  function onOpenTask(task) {
    setActiveTask(task);
  }

  function onCloseTask() {
    setActiveTask(null);
  }

  function onCreateTask() {
    const id = `task-${Date.now()}`;
    setTasks((current) => [
      ...current,
      { id, title: "New Task", notes: [] },
    ]);
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
        {/* ===================== SIDEBAR ===================== */}
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        {/* ===================== WORKSPACE ===================== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {workspaceMode === "dual" && (
            <DualPane
              onFocusPane={onFocusPane}
              leftHeader="Management"
              rightHeader="Development"
              leftBody={
                <div>
                  <p>No tasks in workspace.</p>
                  <p>Management inspection view.</p>
                </div>
              }
              rightBody={
                <div>
                  <p>No tasks in workspace.</p>
                  <p>Development inspection view.</p>
                </div>
              }
            />
          )}

          {workspaceMode === "single" && focusedPane && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>
                  {focusedPane === "management"
                    ? "Management"
                    : "Development"}
                </strong>

                <button
                  type="button"
                  onClick={onReturnToDual}
                  title="Return to dual pane"
                >
                  ↙
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "12px",
                }}
              >
                <p>No tasks in workspace.</p>
                <p>
                  {focusedPane === "management"
                    ? "Management operational view."
                    : "Development operational view."}
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "right",
                }}
              >
                <button disabled>Execute</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTask && (
        <TaskPopup
          task={activeTask}
          onClose={onCloseTask}
        />
      )}
    </>
  );
}
