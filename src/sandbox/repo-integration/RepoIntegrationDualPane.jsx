/* ======================================================================
   METRA – RepoIntegrationDualPane.jsx
   Stage-3A Repository → Workspace Integration (Sandbox Only)
   ----------------------------------------------------------------------
   ✔ Safe clone of DualPane for testing repository imports
   ✔ All Workspace behaviour preserved (summaries, tasks, popups)
   ✔ Imports from TaskRepositorySandbox injected into mgmt / dev panes
   ✔ Pane-expand function restored (NEW DEC 2025)
   ✔ Uses sandbox CSS: RepoIntegrationDualPane.css
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PreProject from "../../components/PreProject.jsx";
import TaskPopup from "../../components/TaskPopup.jsx";
import FilterBar from "../../components/FilterBar.jsx";
import AddItemPopup from "../../components/AddItemPopup.jsx";
import PersonnelOverlay from "../../components/PersonnelOverlay.jsx";
import SummaryOverlay from "../../components/SummaryOverlay.jsx";

import "./RepoIntegrationDualPane.css";

/* ================================================================
   HELPERS
   ================================================================ */
function getNextOrderIndex(tasks, summaries) {
  const all = [...tasks, ...summaries];
  if (all.length === 0) return 0;
  return Math.max(...all.map(i => i.orderIndex ?? 0)) + 1;
}

/* ======================================================================
   MAIN SANDBOX DUAL PANE
   ====================================================================== */
export default function RepoIntegrationDualPane() {

  /* --------------------------------------------------------------
     FILTERS
     -------------------------------------------------------------- */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    else setDevFilter(id);
  };

  /* --------------------------------------------------------------
     LOCAL SUMMARY/TASK STATE (starts empty for sandbox)
     -------------------------------------------------------------- */
  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  /* --------------------------------------------------------------
     POPUPS
     -------------------------------------------------------------- */
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPane, setSelectedPane] = useState(null);

  const openTaskPopup = (task, pane) => {
    setSelectedTask(task);
    setSelectedPane(pane);
  };

  const closeTaskPopup = () => {
    setSelectedTask(null);
    setSelectedPane(null);
  };

  /* ================================================================
     PERSONNEL OVERLAY
     ================================================================ */
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [pendingTaskID, setPendingTaskID] = useState(null);
  const [pendingPane, setPendingPane] = useState(null);

  const requestAssign = (taskID, pane) => {
    setPendingTaskID(taskID);
    setPendingPane(pane);
    setShowPersonnel(true);
  };

  const handlePersonSelected = (name) => {
    const isMgmt = pendingPane === "mgmt";
    const updateFn = isMgmt ? setMgmtTasks : setDevTasks;
    const list = isMgmt ? mgmtTasks : devTasks;

    const updated = list.map(t =>
      t.id === pendingTaskID ? { ...t, person: name, status: "In Progress" } : t
    );

    updateFn(updated);

    setSelectedPane(pendingPane);
    setSelectedTask(updated.find(t => t.id === pendingTaskID));

    setShowPersonnel(false);
  };

  /* ================================================================
     SUMMARY & TASK ADD POPUPS
     ================================================================ */
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [summaryPane, setSummaryPane] = useState(null);

  const openSummaryPopup = (pane) => {
    setSummaryPane(pane);
    setShowSummaryOverlay(true);
  };

  const handleAddSummary = (title) => {
    const isMgmt = summaryPane === "mgmt";
    const currentSummaries = isMgmt ? mgmtSummaries : devSummaries;
    const currentTasks = isMgmt ? mgmtTasks : devTasks;

    const newSummary = {
      id: Date.now(),
      title,
      expanded: true,
      orderIndex: getNextOrderIndex(currentTasks, currentSummaries),
    };

    if (isMgmt) setMgmtSummaries([...mgmtSummaries, newSummary]);
    else setDevSummaries([...devSummaries, newSummary]);

    setShowSummaryOverlay(false);
  };

  const [showMgmtAddPopup, setShowMgmtAddPopup] = useState(false);
  const [showDevAddPopup, setShowDevAddPopup] = useState(false);

  const handleAddMgmtTask = (obj) => {
    const newTask = {
      id: Date.now(),
      title: obj.title,
      status: "Not Started",
      person: "",
      flag: "",
      summaryId: obj.summaryId ?? null,
      orderIndex: getNextOrderIndex(mgmtTasks, mgmtSummaries),
    };
    setMgmtTasks([...mgmtTasks, newTask]);
    setShowMgmtAddPopup(false);
  };

  const handleAddDevTask = (obj) => {
    const newTask = {
      id: Date.now(),
      title: obj.title,
      status: "Not Started",
      person: "",
      flag: "",
      summaryId: obj.summaryId ?? null,
      orderIndex: getNextOrderIndex(devTasks, devSummaries),
    };
    setDevTasks([...devTasks, newTask]);
    setShowDevAddPopup(false);
  };

  /* ======================================================================
     IMPORTS FROM REPOSITORY
     ====================================================================== */
  useEffect(() => {
    const handleImport = (event) => {
      const { type, summaries, tasks } = event.detail;
      const isMgmt = type === "Mgmt";

      const setSummaries = isMgmt ? setMgmtSummaries : setDevSummaries;
      const setTasks = isMgmt ? setMgmtTasks : setDevTasks;

      const currentSummaries = isMgmt ? mgmtSummaries : devSummaries;
      const currentTasks = isMgmt ? mgmtTasks : devTasks;

      let newSummaries = [];
      let newTasks = [];

      summaries.forEach((s) => {
        const newSummary = {
          id: Date.now() + Math.random(),
          title: s.name,
          expanded: true,
          orderIndex: getNextOrderIndex(currentTasks, currentSummaries),
        };

        newSummaries.push(newSummary);

        tasks
          .filter((t) => t.summaryId === s.id || t.summary === s.id)
          .forEach((t) => {
            newTasks.push({
              id: Date.now() + Math.random(),
              title: t.name,
              summaryId: newSummary.id,
              status: "Not Started",
              person: "",
              flag: "",
              orderIndex: getNextOrderIndex(
                [...currentTasks, ...newTasks],
                [...currentSummaries, ...newSummaries]
              ),
            });
          });
      });

      setSummaries([...currentSummaries, ...newSummaries]);
      setTasks([...currentTasks, ...newTasks]);
    };

    window.addEventListener("repoIntegrationImport", handleImport);
    return () => window.removeEventListener("repoIntegrationImport", handleImport);
  }, [mgmtSummaries, devSummaries, mgmtTasks, devTasks]);

  /* ======================================================================
     PANE EXPANSION (NEW)
     ====================================================================== */
  const [expandedPane, setExpandedPane] = useState(null);

  const toggleExpand = (pane) => {
    setExpandedPane(prev => (prev === pane ? null : pane));
  };

  /* ======================================================================
     RENDER
     ====================================================================== */
  return (
    <div className="dual-pane-workspace">

      {/* ========================= MGMT PANE ========================= */}
      <div
        className={
          expandedPane === "dev"
            ? "pane mgmt-pane hidden"
            : expandedPane === "mgmt"
            ? "pane mgmt-pane expanded"
            : "pane mgmt-pane"
        }
      >
        <div className="pane-header">
          <h2>Mgmt Pane (Sandbox)</h2>
          <button className="pane-expand-btn" onClick={() => toggleExpand("mgmt")}>
            {expandedPane === "mgmt" ? "⤡" : "⤢"}
          </button>
        </div>

        <FilterBar mode="mgmt" activeFilter={mgmtFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="mgmt"
            filter={mgmtFilter}
            tasks={mgmtTasks}
            summaries={mgmtSummaries}
            setSummaries={setMgmtSummaries}
            openPopup={(t) => openTaskPopup(t, "mgmt")}
            onRequestAssign={(id) => requestAssign(id, "mgmt")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("mgmt")}>+ Add Summary</button>
          <button onClick={() => setShowMgmtAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* ========================= DEV PANE ========================= */}
      <div
        className={
          expandedPane === "mgmt"
            ? "pane dev-pane hidden"
            : expandedPane === "dev"
            ? "pane dev-pane expanded"
            : "pane dev-pane"
        }
      >
        <div className="pane-header">
          <h2>Dev Pane (Sandbox)</h2>
          <button className="pane-expand-btn" onClick={() => toggleExpand("dev")}>
            {expandedPane === "dev" ? "⤡" : "⤢"}
          </button>
        </div>

        <FilterBar mode="dev" activeFilter={devFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="dev"
            filter={devFilter}
            tasks={devTasks}
            summaries={devSummaries}
            setSummaries={setDevSummaries}
            openPopup={(t) => openTaskPopup(t, "dev")}
            onRequestAssign={(id) => requestAssign(id, "dev")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("dev")}>+ Add Summary</button>
          <button onClick={() => setShowDevAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* ======================= GLOBAL POPUPS ======================= */}
      {showSummaryOverlay &&
        createPortal(
          <SummaryOverlay
            onAdd={handleAddSummary}
            onClose={() => setShowSummaryOverlay(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {showMgmtAddPopup &&
        createPortal(
          <AddItemPopup
            summaries={mgmtSummaries}
            onAdd={handleAddMgmtTask}
            onClose={() => setShowMgmtAddPopup(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {showDevAddPopup &&
        createPortal(
          <AddItemPopup
            summaries={devSummaries}
            onAdd={handleAddDevTask}
            onClose={() => setShowDevAddPopup(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {showPersonnel &&
        createPortal(
          <PersonnelOverlay
            onSelect={handlePersonSelected}
            onClose={() => setShowPersonnel(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
            onUpdate={(fields) => {
              if (fields.delete) {
                const setFn = selectedPane === "mgmt" ? setMgmtTasks : setDevTasks;
                setFn(prev => prev.filter(t => t.id !== selectedTask.id));
                closeTaskPopup();
              } else {
                const setFn = selectedPane === "mgmt" ? setMgmtTasks : setDevTasks;
                const list = selectedPane === "mgmt" ? mgmtTasks : devTasks;
                const updated = list.map(t => t.id === selectedTask.id ? { ...t, ...fields } : t);
                setFn(updated);
                setSelectedTask(updated.find(t => t.id === selectedTask.id));
              }
            }}
            onOpenTemplateRepo={() => {}}
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
