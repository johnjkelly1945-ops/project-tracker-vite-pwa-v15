/* ======================================================================
   METRA – DualPane.jsx
   Unified Repository Integration Version (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Sandbox-safe
   ✔ Legacy repo import DISABLED in sandbox mode
   ✔ No behavioural change to main METRA
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";
import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import SummaryOverlay from "./SummaryOverlay.jsx";

import "../Styles/DualPane.css";

/* ================================================================
   HELPERS
   ================================================================ */
function initialiseItems(list) {
  return list.map((item, index) => ({
    ...item,
    orderIndex: item.orderIndex ?? index,
  }));
}

function getNextOrderIndex(tasks, summaries) {
  const all = [...tasks, ...summaries];
  if (all.length === 0) return 0;
  return Math.max(...all.map(i => i.orderIndex ?? 0)) + 1;
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function DualPane(props) {

  const { sandboxMode = false } = props;

  /* ============================================================
     EXPANSION
     ============================================================ */
  const [expandedPane, setExpandedPane] = useState(null);
  const toggleExpand = (pane) => {
    setExpandedPane(prev => (prev === pane ? null : pane));
  };

  /* FILTERS ---------------------------------------------------- */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    else setDevFilter(id);
  };

  /* ============================================================
     STATE (CONTROLLED BY PARENT IN SANDBOX)
     ============================================================ */
  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  /* ============================================================
     LEGACY GLOBAL IMPORTER (DISABLED IN SANDBOX)
     ============================================================ */
  useEffect(() => {
    if (sandboxMode) return;

    window.onRepoImportToDualPane = (payload) => {
      console.warn("⚠️ Legacy repo import active:", payload);
    };

    return () => {
      delete window.onRepoImportToDualPane;
    };
  }, [sandboxMode]);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="dual-pane-workspace">

      {/* ================= LEFT (MGMT) ================= */}
      <div className="pane mgmt-pane">
        <div className="pane-header">
          <h2>Management Tasks</h2>
        </div>

        <FilterBar mode="mgmt" activeFilter={mgmtFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="mgmt"
            filter={mgmtFilter}
            tasks={props.mgmtTasks}
            summaries={props.mgmtSummaries}
            setSummaries={props.setMgmtSummaries}
            openPopup={(task) => props.openPopup?.(task, "mgmt")}
            onRequestAssign={(id) => props.onRequestAssign?.(id, "mgmt")}
          />
        </div>
      </div>

      {/* ================= RIGHT (DEV) ================= */}
      <div className="pane dev-pane">
        <div className="pane-header">
          <h2>Development Tasks</h2>
        </div>

        <FilterBar mode="dev" activeFilter={devFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="dev"
            filter={devFilter}
            tasks={props.devTasks}
            summaries={props.devSummaries}
            setSummaries={props.setDevSummaries}
            openPopup={(task) => props.openPopup?.(task, "dev")}
            onRequestAssign={(id) => props.onRequestAssign?.(id, "dev")}
          />
        </div>
      </div>

    </div>
  );
}
