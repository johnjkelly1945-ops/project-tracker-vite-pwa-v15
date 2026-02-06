// @ts-nocheck
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ModuleHeader from "./components/ModuleHeader";
import DualPane from "./components/DualPane";
import PreProject from "./components/PreProject";
import TaskPopup from "./components/TaskPopup";
import SummaryMoveModal from "./components/SummaryMoveModal";
import PersonnelPanel from "./components/PersonnelPanel";
import ProjectRegisters from "./components/registers/ProjectRegisters";
import { localAssignees } from "./data/localAssignees";

/*
=====================================================================
METRA — App.jsx
=====================================================================

Stage 230 — Inline Task Status Indicators (Canonical Dot Projection)
Stage 255-A — Personnel Module Container Mounted (Inert)
Stage 264 — Reassignment Made Authoritative (Single-Axis)
Stage 271 — Sidebar Derived Register Wiring (READ-ONLY)

Stage 278 — Project Registers Initial Wiring (READ-ONLY)
---------------------------------------------------------------------
• Wires ProjectRegisters into DualPane (management pane only)
• Implements first register: Artefacts (derived, read-only)
• No navigation, no mutation, no lifecycle
=====================================================================
*/

export default function App() {
  /* ===================== TOP-LEVEL VIEW ===================== */

  const [activeView] = useState("workspace"); // remains inert

  /* ===================== WORKSPACE STATE ===================== */

  const [workspaceMode, setWorkspaceMode] = useState("dual");
  const [focusedPane, setFocusedPane] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const isReadOnly = workspaceMode === "dual" || !focusedPane;
  const isDev = focusedPane === "development";

  /* ===================== DATA ===================== */

  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);
  const [devSummaryOrder, setDevSummaryOrder] = useState([]);

  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [mgmtSummaryOrder, setMgmtSummaryOrder] = useState([]);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeSummaryId, setActiveSummaryId] = useState(null);

  /* ===================== NAV ===================== */

  function handleFocusPane(pane) {
    setWorkspaceMode("single");
    setFocusedPane(pane);
    setActiveTaskId(null);
    setActiveSummaryId(null);
  }

  function returnToDual() {
    setWorkspaceMode("dual");
    setFocusedPane(null);
    setActiveTaskId(null);
    setActiveSummaryId(null);
  }

  /* ===================== HELPERS ===================== */

  function deriveOrderedSummaries(summaries, order) {
    return order.length > 0
      ? order.map((id) => summaries.find((s) => s.id === id)).filter(Boolean)
      : summaries;
  }

  const orderedDevSummaries = deriveOrderedSummaries(
    devSummaries,
    devSummaryOrder
  );

  const orderedMgmtSummaries = deriveOrderedSummaries(
    mgmtSummaries,
    mgmtSummaryOrder
  );

  /* ===================== ARTEFACT DERIVATION (READ-ONLY) ===================== */

  function deriveArtefactsFromTasks(allTasks) {
    if (!Array.isArray(allTasks)) return [];

    const artefacts = [];

    allTasks.forEach((task) => {
      const notes = Array.isArray(task.notes) ? task.notes : [];

      notes.forEach((line) => {
        if (typeof line !== "string") return;

        const isDoc = line.startsWith("[System] Document linked:");
        const isTpl = line.startsWith("[System] Template linked:");

        if (!isDoc && !isTpl) return;

        const parts = line.split(" — ");
        if (parts.length < 2) return;

        const timestamp = parts[parts.length - 1];

        const body = parts[0]
          .replace("[System] Document linked:", "")
          .replace("[System] Template linked:", "")
          .trim();

        const [titleLine, refLine] = body.split("\n");

        if (!titleLine || !refLine) return;

        artefacts.push({
          type: isDoc ? "Document" : "Template",
          title: titleLine.replace(/^"|"$/g, ""),
          ref: refLine.trim(),
          timestamp,
          taskId: task.id,
        });
      });
    });

    return artefacts.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  }

  const allTasks = [...devTasks, ...mgmtTasks];
  const derivedArtefacts = deriveArtefactsFromTasks(allTasks);

  /* ===================== PROJECT REGISTERS ===================== */

  const projectRegisters = [
    {
      title: "Artefacts",
      items: derivedArtefacts,
    },
  ];

  /* ===================== RENDER ===================== */

  return (
    <>
      <ModuleHeader />

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
          derivedArtefacts={derivedArtefacts}
        />

        <DualPane
          mode={workspaceMode}
          focusedPane={focusedPane}
          onFocusPane={handleFocusPane}
          onReturnToDual={returnToDual}
          managementBody={
            <ProjectRegisters registers={projectRegisters} />
          }
          developmentBody={
            <PreProject
              summaries={orderedDevSummaries}
              tasks={devTasks.filter(
                (t) => (t.taskState || "active") !== "archived"
              )}
              onOpenTask={(t) => !isReadOnly && setActiveTaskId(t.id)}
              onOpenSummary={(id) => !isReadOnly && setActiveSummaryId(id)}
              canCreateTask={!isReadOnly}
              onCreateTask={() => {}}
              canCreateSummary={!isReadOnly}
              onCreateSummary={() => {}}
            />
          }
        />
      </div>
    </>
  );
}
