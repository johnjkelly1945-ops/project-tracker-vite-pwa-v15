// @ts-nocheck
/*
=====================================================================
METRA — App.jsx
=====================================================================

STAGES
---------------------------------------------------------------------
Stage 138.1A — Dual-Pane Shell (Inspection Only)
Stage 138.2A — Execution Arrow (Design, Locked)
Stage 139     — Phase 3: Population Verification with Fixture Data
=====================================================================

NOTE
---------------------------------------------------------------------
Fixture data below is intentionally oversized to force scrolling in
both single-pane and dual-pane contexts. This does NOT re-authorise
Create or execution semantics.
=====================================================================
*/

import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import DualPane from "./components/DualPane";
import ModuleHeader from "./components/ModuleHeader";
import PreProject from "./components/PreProject";

/* ================================================================
   PHASE 3 — FIXTURE DATA (READ-ONLY)
   ================================================================ */

const fixtureSummaries = [
  { id: "s1", title: "Summary Alpha" },
  { id: "s2", title: "Summary Beta" },
  { id: "s3", title: "Summary Gamma" },
  { id: "s4", title: "Summary Delta" },
  { id: "s5", title: "Summary Epsilon" },
];

const fixtureTasks = [
  // Orphan tasks (force early scroll)
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `o${i + 1}`,
    title: `Orphan Task ${i + 1}`,
    summaryId: null,
  })),

  // Tasks per summary (oversized on purpose)
  ...fixtureSummaries.flatMap((s, si) =>
    Array.from({ length: 10 }).map((_, ti) => ({
      id: `t-${si + 1}-${ti + 1}`,
      title: `Task ${si + 1}.${ti + 1}`,
      summaryId: s.id,
    }))
  ),
];

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
                <PaneBodyPlaceholder label="LEFT PANE — inspection-only (fixtures not rendered here)" />
              }
              rightHeader={
                <PaneHeader
                  title="RIGHT PANE (inspection)"
                  arrow="↗"
                  onArrow={() => setWorkspaceMode("single")}
                />
              }
              rightBody={
                <PaneBodyPlaceholder label="RIGHT PANE — inspection-only (fixtures not rendered here)" />
              }
            />
          ) : (
            /* ===== SINGLE-PANE EXECUTION (READ-ONLY, FIXTURES) ===== */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
              }}
            >
              <PaneHeader
                title="SINGLE PANE WORKSPACE (fixtures)"
                arrow="↙"
                onArrow={() => setWorkspaceMode("dual")}
              />

              <div style={{ flex: 1, minHeight: 0 }}>
                <PreProject
                  summaries={fixtureSummaries}
                  tasks={fixtureTasks}
                  onOpenTask={() => {}}
                  onCreateTaskIntent={() => {}}
                  onAddSummary={() => {}}
                  moveActiveSummary={() => {}}
                  onRemoveSummary={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
