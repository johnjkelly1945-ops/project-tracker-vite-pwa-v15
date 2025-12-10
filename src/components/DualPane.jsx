/* ======================================================================
   METRA – DualPane.jsx
   Unified Repository Integration Version (Dec 2025)
   ----------------------------------------------------------------------
   ✔ Receives Repository imports from App.jsx
   ✔ Adds imported summaries/tasks to Mgmt or Dev pane (Option B)
   ✔ Appends imported items to bottom of each list
   ✔ No regressions to existing popups or logic
   ✔ No UI changes except Repo integration
   ====================================================================== */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import PreProject from "./PreProject.jsx";
import TaskPopup from "./TaskPopup.jsx";
import FilterBar from "./FilterBar.jsx";
import AddItemPopup from "./AddItemPopup.jsx";
import PersonnelOverlay from "./PersonnelOverlay.jsx";
import SummaryOverlay from "./SummaryOverlay.jsx";
import TemplateRepository from "./TemplateRepository.jsx";

import "../Styles/DualPane.css";

/* ================================================================
   HELPER FUNCTIONS
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
export default function DualPane() {

  /* ============================================================
     EXPANSION TOGGLE
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

  /* SUMMARIES -------------------------------------------------- */
  const [mgmtSummaries, setMgmtSummaries] = useState(() => {
    const saved = localStorage.getItem("mgmtSummaries_v1");
    return saved ? initialiseItems(JSON.parse(saved)) : [];
  });

  const [devSummaries, setDevSummaries] = useState(() => {
    const saved = localStorage.getItem("devSummaries_v1");
    return saved ? initialiseItems(JSON.parse(saved)) : [];
  });

  useEffect(() => {
    localStorage.setItem("mgmtSummaries_v1", JSON.stringify(mgmtSummaries));
  }, [mgmtSummaries]);

  useEffect(() => {
    localStorage.setItem("devSummaries_v1", JSON.stringify(devSummaries));
  }, [devSummaries]);

  /* TASKS ------------------------------------------------------ */
  const [mgmtTasks, setMgmtTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    const list = saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "Prepare Scope Summary", status: "Not Started", person: "", flag: "", summaryId: null },
          { id: 2, title: "Initial Risk Scan", status: "Not Started", person: "", flag: "", summaryId: null },
          { id: 3, title: "Stakeholder Mapping", status: "Not Started", person: "", flag: "", summaryId: null },
        ];
    return initialiseItems(list);
  });

  const [devTasks, setDevTasks] = useState(() => {
    const saved = localStorage.getItem("devtasks_v1");
    const list = saved
      ? JSON.parse(saved)
      : [
          { id: 1001, title: "Review Existing Architecture", status: "Not Started", person: "", flag: "", summaryId: null },
          { id: 1002, title: "Identify Integration Points", status: "In Progress", person: "Demo Dev", flag: "", summaryId: null },
          { id: 1003, title: "Prototype UI Layout", status: "Not Started", person: "", flag: "", summaryId: null },
        ];
    return initialiseItems(list);
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(mgmtTasks));
  }, [mgmtTasks]);

  useEffect(() => {
    localStorage.setItem("devtasks_v1", JSON.stringify(devTasks));
  }, [devTasks]);

  /* ================================================================
     POPUPS
     ================================================================ */
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

  /* PERSONNEL -------------------------------------------------- */
  const [showPersonnel, setShowPersonnel] = useState(false);
  const [pendingTaskID, setPendingTaskID] = useState(null);
  const [pendingPane, setPendingPane] = useState(null);

  const requestAssign = (taskID, pane) => {
    setPendingTaskID(taskID);
    setPendingPane(pane);
    setShowPersonnel(true);
  };

  const handlePersonSelected = (name) => {
    let updateFn, setSelectedFn;

    if (pendingPane === "mgmt") {
      updateFn = setMgmtTasks;
      setSelectedFn = id => setSelectedTask(mgmtTasks.find(t => t.id === id));
    } else {
      updateFn = setDevTasks;
      setSelectedFn = id => setSelectedTask(devTasks.find(t => t.id === id));
    }

    updateFn(prev =>
      prev.map(t => t.id === pendingTaskID ? { ...t, person: name, status: "In Progress" } : t)
    );

    setSelectedPane(pendingPane);
    setSelectedFn(pendingTaskID);

    setShowPersonnel(false);
    setPendingTaskID(null);
    setPendingPane(null);
  };

  /* ================================================================
     UPDATE TASK
     ================================================================ */
  const updateTask = (fields) => {
    const id = selectedTask?.id;
    const pane = fields.pane || selectedPane;

    if (fields.changePerson) {
      requestAssign(id, pane);
      return;
    }

    const setter = pane === "mgmt" ? setMgmtTasks : setDevTasks;
    const list = pane === "mgmt" ? mgmtTasks : devTasks;

    const updated = list.map(t => (t.id === id ? { ...t, ...fields } : t));
    setter(updated);

    if (!fields.delete) {
      setSelectedTask(updated.find(t => t.id === id));
    } else {
      closeTaskPopup();
    }
  };

  /* ================================================================
     SUMMARY POPUP
     ================================================================ */
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [summaryPane, setSummaryPane] = useState(null);

  const openSummaryPopup = (pane) => {
    setSummaryPane(pane);
    setShowSummaryOverlay(true);
  };

  const handleAddSummary = (title) => {
    const nextIndex = summaryPane === "mgmt"
      ? getNextOrderIndex(mgmtTasks, mgmtSummaries)
      : getNextOrderIndex(devTasks, devSummaries);

    const summary = {
      id: Date.now(),
      title,
      expanded: true,
      orderIndex: nextIndex,
    };

    if (summaryPane === "mgmt") setMgmtSummaries([...mgmtSummaries, summary]);
    else setDevSummaries([...devSummaries, summary]);

    setShowSummaryOverlay(false);
  };

  /* ================================================================
     ADD TASK POPUPS
     ================================================================ */
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
      orderIndex: nextIndex,
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
      orderIndex: nextIndex,
    };

    setDevTasks([...devTasks, newTask]);
    setShowDevAddPopup(false);
  };

  /* ================================================================
     REPOSITORY IMPORT (MAIN LOGIC)
     ================================================================ */

  // Create global listener so App.jsx can call into DualPane
  window.onRepoImportToDualPane = (payload) => {
    console.log("📥 DualPane received Repo payload:", payload);

    const { summaries = [], tasks = [], type } = payload;
    const timestamp = Date.now();

    if (type === "Mgmt") {
      // Append summaries
      const nextSummaryIndex = getNextOrderIndex(mgmtTasks, mgmtSummaries);
      const newSummaries = summaries.map((s, i) => ({
        id: "repo_s_" + timestamp + "_" + i,
        title: s,
        expanded: false,
        orderIndex: nextSummaryIndex + i,
      }));

      // Append tasks
      const nextTaskIndex = getNextOrderIndex(mgmtTasks, mgmtSummaries);
      const newTasks = tasks.map((t, i) => ({
        id: "repo_t_" + timestamp + "_" + i,
        title: t,
        status: "Not Started",
        person: "",
        flag: "",
        summaryId: null,
        orderIndex: nextTaskIndex + i,
      }));

      setMgmtSummaries(prev => [...prev, ...newSummaries]);
      setMgmtTasks(prev => [...prev, ...newTasks]);
    }

    if (type === "Dev") {
      const nextSummaryIndex = getNextOrderIndex(devTasks, devSummaries);
      const newSummaries = summaries.map((s, i) => ({
        id: "repo_s_" + timestamp + "_" + i,
        title: s,
        expanded: false,
        orderIndex: nextSummaryIndex + i,
      }));

      const nextTaskIndex = getNextOrderIndex(devTasks, devSummaries);
      const newTasks = tasks.map((t, i) => ({
        id: "repo_t_" + timestamp + "_" + i,
        title: t,
        status: "Not Started",
        person: "",
        flag: "",
        summaryId: null,
        orderIndex: nextTaskIndex + i,
      }));

      setDevSummaries(prev => [...prev, ...newSummaries]);
      setDevTasks(prev => [...prev, ...newTasks]);
    }
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="dual-pane-workspace">

      {/* ===========================================================
          LEFT PANE (MGMT)
      =========================================================== */}
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
          <h2>Management Tasks</h2>

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
            openPopup={(task) => openTaskPopup(task, "mgmt")}
            onRequestAssign={(id) => requestAssign(id, "mgmt")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("mgmt")}>+ Add Summary</button>
          <button onClick={() => setShowMgmtAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* ===========================================================
          RIGHT PANE (DEV)
      =========================================================== */}
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
          <h2>Development Tasks</h2>

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
            openPopup={(task) => openTaskPopup(task, "dev")}
            onRequestAssign={(id) => requestAssign(id, "dev")}
          />
        </div>

        <div className="pane-footer">
          <button onClick={() => openSummaryPopup("dev")}>+ Add Summary</button>
          <button onClick={() => setShowDevAddPopup(true)}>+ Add Task</button>
        </div>
      </div>

      {/* ===========================================================
          GLOBAL PORTALS
      =========================================================== */}
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
