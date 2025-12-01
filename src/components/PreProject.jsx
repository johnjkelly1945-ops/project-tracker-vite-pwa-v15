/* ======================================================================
   METRA – PreProject.jsx
   v8.0 – Stateless Viewer (Architecture B)
   ----------------------------------------------------------------------
   ✔ Receives tasks from DualPane (no internal state)
   ✔ Sends openPopup(task)
   ✔ Sends onRequestAssign(taskID)
   ✔ Applies same filtering rules as before
   ✔ No data storage or business logic inside this component
   ====================================================================== */

import React from "react";
import "../Styles/PreProject.css";

export default function PreProject({
  filter,
  tasks,
  openPopup,
  onRequestAssign
}) {

  /* -------------------------------------------------------------------
     FILTERING – identical behaviour to old system
     ------------------------------------------------------------------- */
  const filteredTasks = (() => {
    switch (filter) {
      case "notstarted":
        return tasks.filter(t => t.status === "Not Started" && !t.flag);
      case "inprogress":
        return tasks.filter(t => t.status === "In Progress");
      case "completed":
        return tasks.filter(t => t.status === "Completed");
      case "flagged":
        return tasks.filter(t => t.flag === "red");
      case "open":
        return tasks.filter(t => t.updatedForPM === true);
      default:
        return tasks;
    }
  })();

  /* -------------------------------------------------------------------
     RENDER – simple stateless map of tasks
     ------------------------------------------------------------------- */
  return (
    <>
      {filteredTasks.map(task => (
        <div
          key={task.id}
          className="pp-task-item"

          onClick={() => {
            // If task not assigned → request person assignment
            if (!task.person || task.person.trim() === "") {
              onRequestAssign(task.id);
            } else {
              openPopup(task);
            }
          }}
        >

          {/* Status Dot */}
          <div
            className={`pp-status-dot ${
              task.status === "Completed"
                ? "status-green"
                : task.person
                ? "status-amber"
                : "status-grey"
            }`}
          />

          {/* Task Title */}
          <div className="pp-task-title">{task.title}</div>

          {/* Flag */}
          {task.flag === "red" && (
            <div className="pp-flag-dot">🚩</div>
          )}
        </div>
      ))}
    </>
  );
}
