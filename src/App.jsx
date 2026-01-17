// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGES
---------------------------------------------------------------------
Stage 138.1A — Dual-Pane Shell (Inspection Only)
Stage 145.1  — Empty Single-Pane Workspace (Structural Baseline)
=====================================================================

NOTE
---------------------------------------------------------------------
All fixture population has been removed.
This file now realises the canonical empty single-pane workspace.
No authority is enabled.
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
            /* ===== SINGLE-PANE WORKSPACE (EMPTY, CANONICAL) ===== */
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
                  tasks={[]}
                  onOpenTask={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
