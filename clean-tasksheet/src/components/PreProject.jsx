/* ======================================================================
   METRA – PreProject.jsx
   Step 6H + Option B Enhanced Popup Integration
   ====================================================================== */

import React, { useState, useEffect } from "react";
import PersonnelOverlay from "./PersonnelOverlay";
import PersonnelDetail from "./PersonnelDetail";
import TaskWorkingWindow from "./TaskWorkingWindow";
import "../Styles/PreProject.css";

const defaultTasks = [
  { id: 1, title: "Prepare Scope Summary", status: "Not Started" },
  { id: 2, title: "Initial Risk Scan", status: "Not Started" },
  { id: 3, title: "Stakeholder Mapping", status: "Not Started" }
];

export default function PreProject() {

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks_v3");
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("task_filter_v3");
    return saved || "All";
  });

  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showPersonnelDetail, setShowPersonnelDetail] = useState(false);
  const [showWorkingWindow, setShowWorkingWindow] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks_v3", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("task_filter_v3", filter);
  }, [filter]);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const filteredTasks = tasks.filter((t) =>
    filter === "All" ? true : t.status === filter
  );

  const openTaskWindow = (taskId) => {
    setActiveTaskId(taskId);
    setShowWorkingWindow(true);
  };

  const startAssignPerson = (taskId) => {
    setActiveTaskId(taskId);
    setShowAssignOverlay(true);
  };

  const openPersonnelDetail = (taskId) => {
    setActiveTaskId(taskId);
    setShowPersonnelDetail(true);
  };

  const applyPersonToTask = (personName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTaskId
          ? { ...t, assigned: personName, status: "In Progress" }
          : t
      )
    );
    setShowAssignOverlay(false);
  };

  const saveNotes = (taskId, entry) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, notes: t.notes ? [...t.notes, entry] : [entry] }
          : t
      )
    );
  };

  const archiveTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setShowWorkingWindow(false);
  };

  const invokeCC = (taskId, type) => {
    saveNotes(taskId, `[CC – ${type}]`);
  };

  const invokeQC = (taskId, type) => {
    saveNotes(taskId, `[QC – ${type}]`);
  };

  return (
    <div className="preproject-wrapper">
      <h1>PreProject – Task Sheet</h1>

      <div className="filter-bar">
        {["All", "Not Started", "In Progress", "Completed", "On Hold"].map((f) => (
          <button
            key={f}
            className={filter === f ? "filter-active" : "filter-btn"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">

            <div className="task-left" onClick={() => openTaskWindow(task.id)}>
              <span className={`status-dot ${task.status.replace(/ /g, "-")}`} />

              <span className="task-title">
                {task.title}

                {task.assigned && (
                  <span
                    className="assigned-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPersonnelDetail(task.id);
                    }}
                  >
                    — {task.assigned}
                  </span>
                )}
              </span>
            </div>

            <button
              className="assign-btn"
              onClick={() => startAssignPerson(task.id)}
            >
              Assign Person
            </button>

          </div>
        ))}
      </div>

      {showAssignOverlay && (
        <PersonnelOverlay
          onSelect={applyPersonToTask}
          onClose={() => setShowAssignOverlay(false)}
        />
      )}

      {showPersonnelDetail && activeTask && (
        <PersonnelDetail
          personName={activeTask.assigned}
          allTasks={tasks}
          onClose={() => setShowPersonnelDetail(false)}
        />
      )}

      {showWorkingWindow && activeTask && (
        <TaskWorkingWindow
          task={activeTask}
          onClose={() => setShowWorkingWindow(false)}
          onSaveNotes={saveNotes}
          onArchiveTask={archiveTask}
          onInvokeCC={invokeCC}
          onInvokeQC={invokeQC}
        />
      )}

    </div>
  );
}
