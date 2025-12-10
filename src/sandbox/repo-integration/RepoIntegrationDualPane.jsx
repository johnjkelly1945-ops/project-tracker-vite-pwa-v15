/* ======================================================================
   METRA – RepoIntegrationDualPane.jsx
   FINAL SANDBOX IMPORT PIPELINE (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Receives repository imports through window.onRepoImportToDualPane
   ✔ Imports summaries and tasks into Mgmt or Dev pane
   ✔ Tasks grouped under imported summary only if they belong there
   ✔ Ungrouped tasks imported as standalone (A1 confirmed)
   ✔ Append-to-bottom using orderIndex
   ✔ No DOM events (removed)
   ✔ All popup behaviour preserved
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PreProject from "../../components/PreProject.jsx";
import TaskPopup from "../../components/TaskPopup.jsx";
import FilterBar from "../../components/FilterBar.jsx";
import AddItemPopup from "../../components/AddItemPopup.jsx";
import PersonnelOverlay from "../../components/PersonnelOverlay.jsx";
import SummaryOverlay from "../../components/SummaryOverlay.jsx";

import { taskLibrary } from "../../taskLibrary.js";
import "./RepoIntegrationDualPane.css";

/* --------------------------------------------------------------
   ORDER INDEX HELPERS
   -------------------------------------------------------------- */
function getNextOrderIndex(tasks, summaries) {
  const all = [...tasks, ...summaries];
  if (all.length === 0) return 0;
  return Math.max(...all.map(i => i.orderIndex ?? 0)) + 1;
}

/* ======================================================================
   MAIN SANDBOX WORKSPACE DUALPANE
   ====================================================================== */
export default function RepoIntegrationDualPane() {

  /* FILTERS ------------------------------------------------------ */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    else setDevFilter(id);
  };

  /* WORKSPACE STATE --------------------------------------------- */
  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  /* POPUPS ------------------------------------------------------- */
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

  /* PERSONNEL ---------------------------------------------------- */
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

  /* SUMMARY ADD -------------------------------------------------- */
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [summaryPane, setSummaryPane] = useState(null);

  const openSummaryPopup = (pane) => {
    setSummaryPane(pane);
    setShowSummaryOverlay(true);
  };

  const handleAddSummary = (title) => {
    const isMgmt = summaryPane === "mgmt";
    const summaries = isMgmt ? mgmtSummaries : devSummaries;
    const tasks = isMgmt ? mgmtTasks : devTasks;

    const newSummary = {
      id: Date.now(),
      title,
      expanded: true,
      orderIndex: getNextOrderIndex(tasks, summaries),
    };

    if (isMgmt) setMgmtSummaries([...mgmtSummaries, newSummary]);
    else setDevSummaries([...devSummaries, newSummary]);

    setShowSummaryOverlay(false);
  };

  /* TASK ADD ----------------------------------------------------- */
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
     IMPORT FROM REPOSITORY (NEW PIPELINE)
     ====================================================================== */
  window.onRepoImportToDualPane = (payload) => {
    console.log("📥 Sandbox DualPane received Repo payload:", payload);

    const { type, summaries = [], tasks = [] } = payload;
    const isMgmt = type === "Mgmt";

    const wsSummaries = isMgmt ? mgmtSummaries : devSummaries;
    const wsTasks = isMgmt ? mgmtTasks : devTasks;

    const setSummaries = isMgmt ? setMgmtSummaries : setDevSummaries;
    const setTasks = isMgmt ? setMgmtTasks : setDevTasks;

    const newSummaries = [];
    const newTasks = [];

    /* ---- Build imported summaries ----------------------------------- */
    summaries.forEach((sid, index) => {
      const summaryObj = taskLibrary.summaries.find(s => s.id === sid);
      if (!summaryObj) return;

      const importedSummary = {
        id: `repo_s_${Date.now()}_${index}`,
        title: summaryObj.name,
        expanded: true,
        orderIndex: getNextOrderIndex([...wsTasks, ...newTasks], [...wsSummaries, ...newSummaries]),
      };

      newSummaries.push(importedSummary);

      /* ---- Add any tasks belonging to this summary ------------------ */
      summaryObj.tasks?.forEach((tid) => {
        if (!tasks.includes(tid)) return;

        const taskObj = taskLibrary.tasks.find(t => t.id === tid);
        if (!taskObj) return;

        newTasks.push({
          id: `repo_t_${Date.now()}_${Math.random()}`,
          title: taskObj.name,
          summaryId: importedSummary.id,
          status: "Not Started",
          person: "",
          flag: "",
          orderIndex: getNextOrderIndex(
            [...wsTasks, ...newTasks],
            [...wsSummaries, ...newSummaries]
          ),
        });
      });
    });

    /* ---- Add standalone (ungrouped) tasks ---------------------------- */
    tasks.forEach((tid) => {
      /* Skip tasks already added to a summary above: */
      const alreadyAdded = newTasks.find(t => t.title === taskLibrary.tasks.find(z => z.id === tid)?.name);
      if (alreadyAdded) return;

      const taskObj = taskLibrary.tasks.find(t => t.id === tid);
      if (!taskObj) return;

      newTasks.push({
        id: `repo_t_${Date.now()}_${Math.random()}`,
        title: taskObj.name,
        summaryId: null,
        status: "Not Started",
        person: "",
        flag: "",
        orderIndex: getNextOrderIndex(
          [...wsTasks, ...newTasks],
          [...wsSummaries, ...newSummaries]
        ),
      });
    });

    /* ---- Commit to workspace state ---------------------------------- */
    setSummaries([...wsSummaries, ...newSummaries]);
    setTasks([...wsTasks, ...newTasks]);
  };

  /* ======================================================================
     PANE EXPANSION
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

      {/* ========================= MGMT ========================= */}
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

      {/* ========================= DEV ========================= */}
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
              const setFn = selectedPane === "mgmt" ? setMgmtTasks : setDevTasks;
              const list = selectedPane === "mgmt" ? mgmtTasks : devTasks;

              if (fields.delete) {
                setFn(list.filter(t => t.id !== selectedTask.id));
                closeTaskPopup();
              } else {
                const updated = list.map(t =>
                  t.id === selectedTask.id ? { ...t, ...fields } : t
                );
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
