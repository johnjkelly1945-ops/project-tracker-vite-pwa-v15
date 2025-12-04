/* ======================================================================
   METRA – DualPane.jsx
   v10 – Template Repository Integration
   ----------------------------------------------------------------------
   ✔ Adds TemplateRepository overlay (global modal)
   ✔ Opens from TaskPopup via onOpenTemplateRepo
   ✔ Pane-aware origin: "management" / "development"
   ✔ Adds clean system note on template selection:
        [System] Template selected: {name} ({method|projectType}) – timestamp
   ✔ Updates correct task list (mgmt/dev)
   ✔ Reopens TaskPopup after template applied
   ✔ NO changes to:
       - CC / QC / Risk / Issue flows
       - Summary module
       - Add Task
       - Personnel overlay
       - Existing logic
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

 // ⭐ NEW

import "../Styles/DualPane.css";

/* ----------------------------------------------------------------------
   Helper: ensure each item has orderIndex
---------------------------------------------------------------------- */
function initialiseItems(list) {
  return list.map((item, index) => ({
    ...item,
    orderIndex: item.orderIndex ?? index,
  }));
}

/* ----------------------------------------------------------------------
   Helper: next chronological index
---------------------------------------------------------------------- */
function getNextOrderIndex(tasks, summaries) {
  const all = [...tasks, ...summaries];
  if (all.length === 0) return 0;
  return Math.max(...all.map((i) => i.orderIndex ?? 0)) + 1;
}

export default function DualPane() {
  /* ================================================================
     FILTER STATES
     ================================================================ */
  const [mgmtFilter, setMgmtFilter] = useState("all");
  const [devFilter, setDevFilter] = useState("all");

  const handleFilterChange = (pane, id) => {
    if (pane === "mgmt") setMgmtFilter(id);
    else setDevFilter(id);
  };

  /* ================================================================
     SUMMARY STORAGE
     ================================================================ */
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

  /* ================================================================
     TASK STORAGE
     ================================================================ */
  const [mgmtTasks, setMgmtTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    const list = saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Prepare Scope Summary",
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: null,
          },
          {
            id: 2,
            title: "Initial Risk Scan",
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: null,
          },
          {
            id: 3,
            title: "Stakeholder Mapping",
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: null,
          },
        ];
    return initialiseItems(list);
  });

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(mgmtTasks));
  }, [mgmtTasks]);

  const [devTasks, setDevTasks] = useState(() => {
    const saved = localStorage.getItem("devtasks_v1");
    const list = saved
      ? JSON.parse(saved)
      : [
          {
            id: 1001,
            title: "Review Existing Architecture",
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: null,
          },
          {
            id: 1002,
            title: "Identify Integration Points",
            status: "In Progress",
            person: "Demo Dev",
            flag: "",
            summaryId: null,
          },
          {
            id: 1003,
            title: "Prototype UI Layout",
            status: "Not Started",
            person: "",
            flag: "",
            summaryId: null,
          },
        ];
    return initialiseItems(list);
  });

  useEffect(() => {
    localStorage.setItem("devtasks_v1", JSON.stringify(devTasks));
  }, [devTasks]);

  /* ================================================================
     POPUP HANDLING
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
    if (pendingPane === "mgmt") {
      const updated = mgmtTasks.map((t) =>
        t.id === pendingTaskID ? { ...t, person: name, status: "In Progress" } : t
      );
      setMgmtTasks(updated);
      setSelectedTask(updated.find((t) => t.id === pendingTaskID));
      setSelectedPane("mgmt");
    } else {
      const updated = devTasks.map((t) =>
        t.id === pendingTaskID ? { ...t, person: name, status: "In Progress" } : t
      );
      setDevTasks(updated);
      setSelectedTask(updated.find((t) => t.id === pendingTaskID));
      setSelectedPane("dev");
    }

    setShowPersonnel(false);
    setPendingTaskID(null);
    setPendingPane(null);
  };

  /* ================================================================
     UPDATE TASK (unchanged)
     ================================================================ */
  const updateTask = (fields) => {
    const id = selectedTask?.id;
    const pane = fields.pane || selectedPane;

    // Personnel change routing
    if (fields.changePerson) {
      requestAssign(id, pane);
      return;
    }

    // Normal updates
    if (pane === "mgmt") {
      const updated = mgmtTasks.map((t) =>
        t.id === id ? { ...t, ...fields } : t
      );
      setMgmtTasks(updated);
      if (!fields.delete) setSelectedTask(updated.find((t) => t.id === id));
      else closeTaskPopup();
    }

    if (pane === "dev") {
      const updated = devTasks.map((t) =>
        t.id === id ? { ...t, ...fields } : t
      );
      setDevTasks(updated);
      if (!fields.delete) setSelectedTask(updated.find((t) => t.id === id));
      else closeTaskPopup();
    }
  };

  /* ================================================================
     TEMPLATE REPOSITORY – NEW STATE
     ================================================================ */
  const [showTemplateRepo, setShowTemplateRepo] = useState(false);
  const [repoTask, setRepoTask] = useState(null);
  const [repoPane, setRepoPane] = useState(null); // "management" / "development"

  /* --------------------------------------------------------------
     OPEN TEMPLATE REPOSITORY
     -------------------------------------------------------------- */
  const handleOpenTemplateRepo = ({ task, pane }) => {
    setRepoTask(task);
    setRepoPane(pane === "mgmt" ? "management" : "development");
    setShowTemplateRepo(true);
  };

  /* --------------------------------------------------------------
     TEMPLATE SELECTED – ADD SYSTEM NOTE + UPDATE TASK
     -------------------------------------------------------------- */
  const handleTemplateSelected = (templateObj) => {
    if (!templateObj || !repoTask) return;

    const timestamp = (function () {
      const t = new Date();
      const dd = String(t.getDate()).padStart(2, "0");
      const mm = String(t.getMonth() + 1).padStart(2, "0");
      const yyyy = t.getFullYear();
      const HH = String(t.getHours()).padStart(2, "0");
      const MM = String(t.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
    })();

    // Determine descriptor (method or projectType)
    const detail =
      repoPane === "management"
        ? templateObj.method
        : templateObj.projectType;

    const systemNote = `[System] Template selected: ${templateObj.name} (${detail}) – ${timestamp}`;

    const isMgmt = repoPane === "management";

    // Build updated history
    const history = repoTask.notes ? repoTask.notes.trimEnd() : "";
    const updatedNotes = history
      ? `${history}\n\n${systemNote}\n\n`
      : `${systemNote}\n\n`;

    // Update correct task list
    if (isMgmt) {
      const updated = mgmtTasks.map((t) =>
        t.id === repoTask.id ? { ...t, notes: updatedNotes } : t
      );
      setMgmtTasks(updated);
      setSelectedTask(updated.find((t) => t.id === repoTask.id));
      setSelectedPane("mgmt");
    } else {
      const updated = devTasks.map((t) =>
        t.id === repoTask.id ? { ...t, notes: updatedNotes } : t
      );
      setDevTasks(updated);
      setSelectedTask(updated.find((t) => t.id === repoTask.id));
      setSelectedPane("dev");
    }

    // Close template repository
    setShowTemplateRepo(false);
  };

  /* ================================================================
     SUMMARY CREATION (unchanged)
     ================================================================ */
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [summaryPane, setSummaryPane] = useState(null);

  const openSummaryPopup = (pane) => {
    setSummaryPane(pane);
    setShowSummaryOverlay(true);
  };

  const handleAddSummary = (title) => {
    const nextIndex =
      summaryPane === "mgmt"
        ? getNextOrderIndex(mgmtTasks, mgmtSummaries)
        : getNextOrderIndex(devTasks, devSummaries);

    const summary = {
      id: Date.now(),
      title,
      expanded: true,
      orderIndex: nextIndex,
    };

    if (summaryPane === "mgmt")
      setMgmtSummaries([...mgmtSummaries, summary]);
    else setDevSummaries([...devSummaries, summary]);

    setShowSummaryOverlay(false);
    setSummaryPane(null);
  };

  /* ================================================================
     ADD TASK POPUPS (unchanged)
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
     RENDER
     ================================================================ */
  return (
    <div className="dual-pane-workspace">
      {/* LEFT PANE ==================================================== */}
      <div className="pane mgmt-pane">
        <div className="pane-header">
          <h2>Management Tasks</h2>
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
          <button className="footer-text-btn" onClick={() => openSummaryPopup("mgmt")}>
            + Add Summary
          </button>
          <button className="footer-text-btn" onClick={() => setShowMgmtAddPopup(true)}>
            + Add Task
          </button>
        </div>
      </div>

      {/* RIGHT PANE ==================================================== */}
      <div className="pane dev-pane">
        <div className="pane-header">
          <h2>Development Tasks</h2>
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
          <button className="footer-text-btn" onClick={() => openSummaryPopup("dev")}>
            + Add Summary
          </button>
          <button className="footer-text-btn" onClick={() => setShowDevAddPopup(true)}>
            + Add Task
          </button>
        </div>
      </div>

      {/* GLOBAL POPUPS ============================================== */}

      {/* Summary */}
      {showSummaryOverlay &&
        createPortal(
          <SummaryOverlay
            onAdd={handleAddSummary}
            onClose={() => setShowSummaryOverlay(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {/* Add Task (Mgmt) */}
      {showMgmtAddPopup &&
        createPortal(
          <AddItemPopup
            summaries={mgmtSummaries}
            onAdd={handleAddMgmtTask}
            onClose={() => setShowMgmtAddPopup(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {/* Add Task (Dev) */}
      {showDevAddPopup &&
        createPortal(
          <AddItemPopup
            summaries={devSummaries}
            onAdd={handleAddDevTask}
            onClose={() => setShowDevAddPopup(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {/* Personnel */}
      {showPersonnel &&
        createPortal(
          <PersonnelOverlay
            onSelect={handlePersonSelected}
            onClose={() => setShowPersonnel(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {/* Template Repository – ⭐ NEW GLOBAL MODAL */}
      {showTemplateRepo &&
        createPortal(
          <TemplateRepository
            origin={repoPane}
            onSelectTemplate={handleTemplateSelected}
            onClose={() => setShowTemplateRepo(false)}
          />,
          document.getElementById("metra-popups")
        )}

      {/* Task Popup */}
      {selectedTask &&
        createPortal(
          <TaskPopup
            task={selectedTask}
            pane={selectedPane}
            onClose={closeTaskPopup}
            onUpdate={updateTask}
            onOpenTemplateRepo={handleOpenTemplateRepo}  // ⭐ NEW
          />,
          document.getElementById("metra-popups")
        )}
    </div>
  );
}
