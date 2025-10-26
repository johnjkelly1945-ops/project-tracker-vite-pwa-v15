/* === METRA – TaskPopupChangeTest.jsx
   Phase 9.8A – Embedded Mini-Task Workflow Prototype
   -------------------------------------------------
   Introduces process tabs [Change][Risk][Issue][Quality].
   Adds non-persistent “mini-tasks” for Change Control with
   Start / Complete buttons and placeholder comms sections.
*/

import React, { useState } from "react";
import "../Styles/TaskPopupChangeTest.css";

const TaskPopupChangeTest = ({ task, onClose }) => {
  if (!task) return null;

  const [activeProcess, setActiveProcess] = useState("change");

  // Mini-tasks for Change process
  const [changeSteps, setChangeSteps] = useState([
    {
      id: 1,
      title: "Impact Assessment",
      status: "Not Started",
      startedAt: "",
      completedAt: "",
    },
    {
      id: 2,
      title: "Board Review",
      status: "Not Started",
      startedAt: "",
      completedAt: "",
    },
    {
      id: 3,
      title: "Implementation Verification",
      status: "Not Started",
      startedAt: "",
      completedAt: "",
    },
  ]);

  // Handle Start and Complete actions
  const handleStart = (id) => {
    setChangeSteps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "In Progress", startedAt: new Date().toLocaleString() }
          : s
      )
    );
    console.log("🟢 Started mini-task", id);
  };

  const handleComplete = (id) => {
    setChangeSteps((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "Completed", completedAt: new Date().toLocaleString() }
          : s
      )
    );
    console.log("✅ Completed mini-task", id);
  };

  const renderChangePanel = () => (
    <div className="process-panel">
      <h4 className="process-title">Change Control Steps</h4>
      {changeSteps.map((step) => (
        <div key={step.id} className="mini-task-block">
          <div className="mini-task-header">
            <span className="mini-task-title">{step.title}</span>
            <div className="mini-task-buttons">
              <button
                className="start-btn"
                onClick={() => handleStart(step.id)}
                disabled={step.status !== "Not Started"}
              >
                🟢 Start
              </button>
              <button
                className="complete-btn"
                onClick={() => handleComplete(step.id)}
                disabled={step.status === "Completed"}
              >
                ✅ Complete
              </button>
            </div>
          </div>

          <div className="mini-task-status-line">
            <span
              className={`mini-status ${
                step.status === "Completed"
                  ? "done"
                  : step.status === "In Progress"
                  ? "active"
                  : "pending"
              }`}
            >
              {step.status}
            </span>
            {step.startedAt && (
              <span className="timestamp">Started: {step.startedAt}</span>
            )}
            {step.completedAt && (
              <span className="timestamp">Completed: {step.completedAt}</span>
            )}
          </div>

          <div className="mini-task-comms">
            <div className="comms-title">Comms / Notes</div>
            <ul className="comms-list">
              <li className="comms-item">[Sample] Awaiting feedback from team</li>
              <li className="comms-item">[Sample] Email sent to PM for approval</li>
            </ul>
            <button className="add-note-btn">+ Add Note</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPlaceholderPanel = (label) => (
    <div className="process-panel placeholder">
      <h4 className="process-title">{label} Process</h4>
      <p>Coming soon in Phase 9.8B – workflow & persistence logic.</p>
    </div>
  );

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Change Control Task</h3>

        {/* Process Tab Bar */}
        <div className="process-tab-bar">
          {["change", "risk", "issue", "quality"].map((p) => (
            <button
              key={p}
              className={`process-tab ${
                activeProcess === p ? "active" : ""
              }`}
              onClick={() => setActiveProcess(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Active Process Panel */}
        {activeProcess === "change" && renderChangePanel()}
        {activeProcess === "risk" && renderPlaceholderPanel("Risk")}
        {activeProcess === "issue" && renderPlaceholderPanel("Issue")}
        {activeProcess === "quality" && renderPlaceholderPanel("Quality")}

        <button className="popup-close" onClick={onClose}>
          × Close
        </button>
      </div>
    </div>
  );
};

export default TaskPopupChangeTest;
