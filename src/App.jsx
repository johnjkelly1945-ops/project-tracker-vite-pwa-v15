// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
STAGE 164 — Workspace Shell Correction & Sidebar Decoupling
---------------------------------------------------------------------
• App frames the workspace; it does NOT own viewport math
• Exactly one scroll owner exists inside the workspace
• Sidebar is structurally decoupled from workspace width
• DualPane remains always mounted and owns pane layout only
• Single-pane is a structural collapse, not a replacement
• No task, execution, or authority semantics changed
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

  const [workspaceMode, setWorkspaceMode] = useState("dual"); // "dual" | "single"
  const [focusedPane, setFocusedPane] = useState(null);       // "management" | "development" | null

  /* ===================== DATA (UNCHANGED) ===================== */

  const [summaries, setSummaries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  /* ===================== SIDEBAR UI ===================== */

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  /* ===================== PANE FOCUS HANDLERS ===================== */

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

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      {/* 
        APP FRAME (no viewport math here)
        Sidebar is a frame peer, not a layout peer.
      */}
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        {/* ===================== SIDEBAR ===================== */}
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        {/* ===================== WORKSPACE FRAME ===================== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* 
            WORKSPACE SCROLL OWNER
            Owns vertical scrolling below ModuleHeader
          */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              minHeight: 0,
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
                    focus="management"
                    onReturnToDual={onReturnToDual}
                  />
                ) : (
                  <>
                    <p>No tasks in workspace.</p>
                    <p>Management inspection view.</p>
                  </>
                )
              }
              developmentBody={
                workspaceMode === "single" && focusedPane === "development" ? (
                  <PreProject
                    focus="development"
                    onReturnToDual={onReturnToDual}
                  />
                ) : (
                  <>
                    <p>No tasks in workspace.</p>
                    <p>Development inspection view.</p>
                  </>
                )
              }
            />
          </div>
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
