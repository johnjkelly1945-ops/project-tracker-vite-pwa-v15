/* ======================================================================
   METRA – RepoIntegrationDualPane.jsx
   Stage-3A Sandbox – Workspace Import Integration
   ----------------------------------------------------------------------
   ✔ Full workspace logic preserved
   ✔ Imports summaries + tasks from Repository Sandbox
   ✔ Correct 2-stage delete (first press confirm, second press remove)
   ✔ Proper task removal from mgmt/dev panes
   ✔ No persistence (sandbox-only)
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PreProject from "../../components/PreProject.jsx";
import TaskPopup from "../../components/TaskPopup.jsx";
import FilterBar from "../../components/FilterBar.jsx";
import AddItemPopup from "../../components/AddItemPopup.jsx";
import PersonnelOverlay from "../../components/PersonnelOverlay.jsx";
import SummaryOverlay from "../../components/SummaryOverlay.jsx";

import "../../Styles/DualPane.css";

/* ================================================================
   HELPER FUNCTIONS
   ================================================================ */
function initialiseItems(list) {
  return list.map((item, index) => ({
    ...item,
    orderIndex: item.orderIndex ?? index
  }));
}

function getNextOrderIndex(tasks, summaries) {
  const all = [...tasks, ...summaries];
  if (all.length === 0) return 0;
  return Math.max(...all.map(i => i.orderIndex ?? 0)) + 1;
}

/* ======================================================================
   MAIN SANDBOX WORKSPACE COMPONENT
   ====================================================================== */
export default function RepoIntegrationDualPane() {

  /* FILTER STATE ------------------------------------------------ */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    else setDevFilter(id);
  };

  /* SUMMARY STATE ----------------------------------------------- */
  const [mgmtSummaries, setMgmtSummaries] = useState([]);
  const [devSummaries, setDevSummaries] = useState([]);

  /* TASK STATE -------------------------------------------------- */
  const [mgmtTasks, setMgmtTasks] = useState([]);
  const [devTasks, setDevTasks] = useState([]);

  /* POPUP STATE ------------------------------------------------- */
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

  /* PERSONNEL OVERLAY ------------------------------------------ */
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
    const setter = isMgmt ? setMgmtTasks : setDevTasks;
    const list = isMgmt ? mgmtTasks : devTasks;

    setter(prev =>
      prev.map(t => t.id === pendingTaskID
        ? { ...t, person: name, status: "In Progress" }
        : t
      )
    );

    const updated = list.find(t => t.id === pendingTaskID);
    setSelectedTask(updated);
    setSelectedPane(pendingPane);

    setShowPersonnel(false);
    setPendingTaskID(null);
    setPendingPane(null);
  };

  /* ======================================================================
     UPDATE TASK (CORRECTED DELETE BEHAVIOUR)
     ====================================================================== */
  const updateTask = (fields) => {
    const id = selectedTask?.id;
    const paneToUse = fields.pane || selectedPane;

    const isMgmt = paneToUse === "mgmt";
    const setter = isMgmt ? setMgmtTasks : setDevTasks;
    const list = isMgmt ? mgmtTasks : devTasks;

    /* --- DELETE FIX: properly remove task before closing --- */
    if (fields.delete) {
      const filtered = list.filter(t => t.id !== id);
      setter(filtered);
      closeTaskPopup();
      return;
    }

    /* --- CHANGE PERSON HANDOFF --- */
    if (fields.changePerson) {
      requestAssign(id, paneToUse);
      return;
    }

    /* --- NORMAL TASK UPDATE --- */
    const updated = list.map(t =>
      t.id === id ? { ...t, ...fields } : t
    );

    setter(updated);
    setSelectedTask(updated.find(t => t.id === id));
  };

  /* ======================================================================
     ADD SUMMARY POPUP
     ====================================================================== */
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [summaryPane, setSummaryPane] = useState(null);

  const openSummaryPopup = (pane) => {
    setSummaryPane(pane);
    setShowSummaryOverlay(true);
  };

  const handleAddSummary = (title) => {
    const isMgmt = summaryPane === "mgmt";
    const setter = isMgmt ? setMgmtSummaries : setDevSummaries;
    const tasks = isMgmt ? mgmtTasks : devTasks;
    const summaries = isMgmt ? mgmtSummaries : devSummaries;

    const nextIndex = getNextOrderIndex(tasks, summaries);

    const summary = {
      id: Date.now(),
      title,
      expanded: true,
      orderIndex: nextIndex
    };

    setter([...summaries, summary]);
    setShowSummaryOverlay(false);
  };

  /* ======================================================================
     ADD TASK POPUPS
     ====================================================================== */
  const [showDevAddPopup, setShowDevAddPopup] = useState(false);
  const [showMgmtAddPopup, setShowMgmtAddPopup] = useState(false);

  const handleAddMgmtTask = (obj) => {
    const nextIndex = getNextOrderIndex(mgmtTasks, mgmtSummaries);
    const newTask = {
      id: Date.now(),
      title: obj.title,
      status: "Not Started",
      person: "",
      flag: "",
      summaryId: obj.summaryId ?? null,
      orderIndex: nextIndex
    };
    setMgmtTasks([...mgmtTasks, newTask]);
    setShowMgmtAddPopup(false);
  };

  const handleAddDevTask = (obj) => {
    const nextIndex = getNextOrderIndex(devTasks, devSummaries);
    const newTask = {
      id: Date.now(),
      title: obj.title,
      status: "Not Started",
      person: "",
      flag: "",
      summaryId: obj.summaryId ?? null,
      orderIndex: nextIndex
    };
    setDevTasks([...devTasks, newTask]);
    setShowDevAddPopup(false);
  };

  /* ======================================================================
     HANDLE IMPORTS FROM REPOSITORY SANDBOX
     ====================================================================== */
  useEffect(() => {
    const handler = (event) => {
      const data = event.detail;
      if (!data) return;

      console.log("🔵 IMPORT RECEIVED IN SANDBOX:", data);

      const { type, summaries, tasks } = data;

      if (type === "Mgmt") {
        importIntoWorkspace("mgmt", summaries, tasks);
      } else {
        importIntoWorkspace("dev", summaries, tasks);
      }
    };

    window.addEventListener("repoIntegrationImport", handler);
    return () => window.removeEventListener("repoIntegrationImport", handler);
  }, [mgmtSummaries, devSummaries, mgmtTasks, devTasks]);

  /* ======================================================================
     SAFE IMPORT LOGIC
     ====================================================================== */
  const importIntoWorkspace = (pane, summaryList, taskList) => {
    const isMgmt = pane === "mgmt";
    const setSummaries = isMgmt ? setMgmtSummaries : setDevSummaries;
    const setTasks = isMgmt ? setMgmtTasks : setDevTasks;

    const currentSummaries = isMgmt ? mgmtSummaries : devSummaries;
    const currentTasks = isMgmt ? mgmtTasks : devTasks;

    let newSummaries = [];
    let newTasks = [];

    /* ---- IMPORT SUMMARIES ---- */
    summaryList.forEach((s) => {
      const idx = getNextOrderIndex(currentTasks, currentSummaries);
      const newSum = {
        id: Date.now() + Math.random(),
        title: s.name,
        expanded: true,
        orderIndex: idx
      };
      newSummaries.push(newSum);

      /* ---- IMPORT TASKS LINKED TO THIS SUMMARY ---- */
      taskList
        .filter((t) => t.summaryId === s.id || t.summary === s.id)
        .forEach((t) => {
          newTasks.push({
            id: Date.now() + Math.random(),
            title: t.name,
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: newSum.id,
            orderIndex: getNextOrderIndex(
              currentTasks,
              [...currentSummaries, ...newSummaries]
            )
          });
        });
    });

    setSummaries([...currentSummaries, ...newSummaries]);
    setTasks([...currentTasks, ...newTasks]);

    console.log("✅ Imported into", pane, { newSummaries, newTasks });
  };

  /* ======================================================================
     RENDER
     ====================================================================== */
  return (
    <div className="dual-pane-workspace">

      {/* =========================== LEFT PANE ============================ */}
      <div className="pane mgmt-pane">
        <div className="pane-header"><h2>Mgmt Pane (Sandbox)</h2></div>

        <FilterBar mode="mgmt" activeFilter={mgmtFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="mgmt"
            filter={mgmtFilter}
            tasks={mgmtTasks}
            summaries={mgmtSummaries}
            setSummaries={setMgmtSummaries}
            openPopup={(task) => openTaskPopup(task, "mgmt")}
            onRequestAssign={(id) => requestAssign(id, "mgmt")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("mgmt")}>+ Add Summary</button>
          <button onClick={() => setShowMgmtAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* =========================== RIGHT PANE =========================== */}
      <div className="pane dev-pane">
        <div className="pane-header"><h2>Dev Pane (Sandbox)</h2></div>

        <FilterBar mode="dev" activeFilter={devFilter} onChange={handleFilterChange} />

        <div className="pane-content">
          <PreProject
            pane="dev"
            filter={devFilter}
            tasks={devTasks}
            summaries={devSummaries}
            setSummaries={setDevSummaries}
            openPopup={(task) => openTaskPopup(task, "dev")}
            onRequestAssign={(id) => requestAssign(id, "dev")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("dev")}>+ Add Summary</button>
          <button onClick={() => setShowDevAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* =========================== GLOBAL POPUPS ======================== */}
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
            onUpdate={updateTask}
            onOpenTemplateRepo={() => {}}
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
