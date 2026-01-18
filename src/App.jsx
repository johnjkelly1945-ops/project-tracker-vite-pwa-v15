// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGES
---------------------------------------------------------------------
Stage 138.1A — Dual-Pane Shell (Inspection Only)
Stage 145.1  — Empty Single-Pane Workspace (Structural Baseline)
Stage 146    — Gate G1: Task Creation Authority (State Wiring Only)
=====================================================================

NOTE
---------------------------------------------------------------------
This file introduces Gate G1 state ONLY.
No UI affordance is rendered here.
No implicit authority is enabled.
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import DualPane from "./components/DualPane";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";

/* ================================================================
   UI CHROME
   ================================================================ */

function PaneHeader({ title, arrow, onArrow }) {
  return (
    <div
      style={{
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid #e0e0e0",
        background: "#fafafa",
        color: "#333",
        fontSize: "16px",
        fontWeight: 600,
        userSelect: "none",
      }}
    >
      <span>{title}</span>

      {arrow && (
        <button
          aria-label="Workspace mode transition"
          onClick={onArrow}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            color: "#555",
          }}
        >
          {arrow}
        </button>
      )}
    </div>
  );
}

function PaneBodyPlaceholder({ label }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "14px",
        letterSpacing: "0.08em",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}

/* ================================================================
   APP
   ================================================================ */

export default function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState("dual"); // 'dual' | 'single'

  /* ================================================================
     STAGE 146 — GATE G1 STATE (EXPLICIT, STAGE-LOCAL)
     ================================================================ */

  const [gateG1Open] = useState(true); // Stage 146 only

  /* ================================================================
     TASK STATE (EMPTY → POPULATED ONLY VIA G1)
     ================================================================ */

  const [tasks, setTasks] = useState([]);

  function createTaskViaG1() {
    if (!gateG1Open) return;
    if (workspaceMode !== "single") return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        __createdVia: "G1",
      },
    ]);
  }

  const isDual = workspaceMode === "dual";

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
        />

        <div style={{ flex: 1, minHeight: 0 }}>
          {isDual ? (
            <DualPane
              leftHeader={
                <PaneHeader
                  title="LEFT PANE (inspection)"
                  arrow="↗"
                  onArrow={() => setWorkspaceMode("single")}
                />
              }
              leftBody={
                <PaneBodyPlaceholder label="LEFT PANE — inspection-only" />
              }
              rightHeader={
                <PaneHeader
                  title="RIGHT PANE (inspection)"
                  arrow="↗"
                  onArrow={() => setWorkspaceMode("single")}
                />
              }
              rightBody={
                <PaneBodyPlaceholder label="RIGHT PANE — inspection-only" />
              }
            />
          ) : (
            /* ===== SINGLE-PANE WORKSPACE (G1-WIRED, UI-NEUTRAL) ===== */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
              }}
            >
              <PaneHeader
                title="SINGLE PANE WORKSPACE"
                arrow="↙"
                onArrow={() => setWorkspaceMode("dual")}
              />

              <div style={{ flex: 1, minHeight: 0 }}>
                <PreProject
                  summaries={[]}
                  tasks={tasks}
                  onOpenTask={() => {}}
                  onCreateTask={createTaskViaG1}
                  canCreateTask={gateG1Open && workspaceMode === "single"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
